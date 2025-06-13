import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import AdminSideBar,{ SidebarItem } from './AdminSideBar';
import { getUserData , storeUserData, removeUserData} from '../service/StorageService.jsx';
import Loader from '../Loader.jsx';
import {toast} from 'react-hot-toast';
import {
  LayoutDashboard,
  User,
  BookOpenText,
  FileText,
  Home,
  UserPlus,
  ChevronRight,
  ClipboardEditIcon
} from 'lucide-react';

import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setExpanded } from '../redux/ExpandedSlicer.jsx';

function AdminMainLayout() {

    const [makeLoading,setMakeLoading]=useState(false);
    const [userData, setUserData] = useState({});
    const navigate=useNavigate(null);
    const location=useLocation();
    const expanded=useSelector((state)=>state.expanded);
    const dispatch=useDispatch();
    const apiUrl=import.meta.env.VITE_SERVER_API;
    const [selectedPath,setSelectedPath]=useState({});
    const PageNavData=[
    {name:"Dashboard",path:'/admin',icon:<LayoutDashboard size={26}/>},
    {name:"Manage Users",path:'/admin/manage-users',icon:<User size={26}/>},
    {name:"Manage Enrollments",path:'/admin/manage-enrollments',icon:<UserPlus size={26}/>},
    {name:"Manage Courses",path:'/admin/manage-courses',icon:<BookOpenText size={26}/>},
    {name:"Manage Submissions",path:'/admin/manage-submissions',icon:<FileText size={26}/>},
    {name:"Manage Tasks",path:'/admin/manage-tasks',icon:<ClipboardEditIcon size={26}/>},
  ];

  const onNavInfoClicked=()=>{
    navigate(-1);
  }

  useEffect(()=>{
    const MakeNavigationAction=()=>{
      let currentPath=window.location.pathname;
      setSelectedPath(PageNavData.filter((item)=>item.path==currentPath)[0]);
    }
    const sessionCheck = async () => {
      setMakeLoading(true);
      try {
        const res = await axios.get(`${apiUrl}/api/protect/session-check`, {
          withCredentials: true,
        });
        storeUserData(res.data.user_data);
        setUserData({...getUserData(),status:true});
        setMakeLoading(false);
      } catch (error) {
        if(error.status===401){
          toast.error(error?.response?.data?.message);
        }
        removeUserData();
        setMakeLoading(false);
        navigate('/');
      }
    };
    sessionCheck();
  MakeNavigationAction();
  },[navigate]);


    useEffect(()=>{
      const fetchAdminData=async()=>{
        setMakeLoading(true);
        try {
          const data=getUserData();
          const res=await axios.post(apiUrl+'/api/protect/role-auth',data);
          setUserData({...res.data.user_data,...{status:true}});
          toast.success('Welcome back, Admin '+res.data.user_data.name);
        } catch (error) {
          toast.error(error.response.data.message);
          navigate('/');
        } finally{
          setMakeLoading(false);
        }
      }

      fetchAdminData();
    },[]);

      const onSideNavClicked=()=>{
        dispatch(setExpanded());
        window.location.reload();
      }

  return (
    <>
      <div className=' h-screen flex items-start justify-normal p-3 gap-x-2'>

      {/* Side Bar */}
      <AdminSideBar user_data={userData}>

      <NavLink to="/admin">
      {({ isActive }) => (
        <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={isActive} />
      )}
      </NavLink>

      <NavLink to="/admin/manage-users">
      {({ isActive }) => (
        <SidebarItem icon={<User size={20} />} text="Manage Users" active={isActive} />
      )}
      </NavLink>

      <NavLink to="/admin/manage-enrollments">
      {({ isActive }) => (
        <SidebarItem icon={<UserPlus size={20} />} text="Manage Enrollments" active={isActive} />
      )}
      </NavLink>

      <NavLink to="/admin/manage-courses">
      {({ isActive }) => (
        <SidebarItem icon={<BookOpenText size={20} />} text="Manage Courses" active={isActive} />
      )}
      </NavLink>

      <NavLink to="/admin/manage-submissions">
      {({ isActive }) => (
        <SidebarItem icon={<FileText size={20} />} text="Manage Submissions" active={isActive} />
      )}
      </NavLink>

      <hr className='py-1.5'/>

      <NavLink to="/">
      {({ isActive }) => (
        <SidebarItem icon={<Home size={20} />} text="Home" active={isActive} />
      )}
      </NavLink>

      </AdminSideBar>

      {/* Admin Pages */}
        <div className={`flex-1 p-0 overflow-auto h-full sm:block  ${expanded? 'hidden':'block'}`}>

          <h1 className='flex items-center justify-normal'>
          <div>{selectedPath.icon}</div>
          <span className={`text-2xl p-1 font-bold text-black cursor-pointer whitespace-nowrap
          `} onClick={()=>onNavInfoClicked()}>{selectedPath.name}</span>
          {selectedPath.path=== '/admin/manage-tasks' && (
            <span className=' flex items-center justify-normal text-xl font-semibold text-black capitalize gap-x-1'>
            <ChevronRight size={20}/>
            <span className='whitespace-nowrap overflow-hidden text-ellipsis w-28 sm:w-auto'>
            {location?.state?.title}  
            </span>
            </span>
          )}
          </h1>

          <div className={`w-full h-screen border overflow-y-auto p-2 rounded-lg`}>
            <Outlet />
          </div>
        </div>

      <div className={`whitespace-nowrap w-auto text-justify mt-96 flex items-center justify-center rotate-90 gap-x-1.5 text-2xl sm:hidden 
        ${expanded?'block':'hidden'}
        `} onClick={onSideNavClicked}>
        
        {selectedPath.icon}
        {selectedPath.name}  
  
        </div>
      </div>
      <Loader loading={makeLoading}/>
    </>
  )
}

export default AdminMainLayout