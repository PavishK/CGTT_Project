import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { getUserData, storeUserData,removeUserData } from '../service/StorageService';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Loader from '../Loader.jsx';
import '../index.css';
import Sidebar, { SidebarItem } from "./SideBar.jsx"
import { useSelector, useDispatch } from 'react-redux';
import { setExpanded } from '../redux/ExpandedSlicer.jsx';
import { useLocation } from 'react-router-dom';

import {
  Home,
  BookOpen,
  ClipboardCheck,
  BadgeCheck,
  ShieldCheck,
  User, 
  Info,
  UserCog,
  ChevronRight,
} from "lucide-react";

function MainLayout() {

  const dispatch=useDispatch();
  const location=useLocation();
  const navigate=useNavigate(null) 

  const [userData, setUserData] = useState({});
  const apiUrl = import.meta.env.VITE_SERVER_API;
  const [makeLoading,setMakeLoading]=useState(false);
  const expanded=useSelector((state)=>state.expanded);
  const [selectedPath,setSelectedPath]=useState({});

  const PageNavData=[
    {name:"Home",path:'/',icon:<Home size={26}/>},
    {name:"Courses",path:'/courses',icon:<BookOpen size={26}/>},
    {name:"Courses",subName:location?.state?.title?? '',path:`/selected-course`,icon:<BookOpen size={26}/>},
    {name:"Submissions",path:'/submissions',icon:<ClipboardCheck size={26}/>},
    {name:"Certificates",path:'/certificates',icon:<BadgeCheck size={26}/>},
    {name:"Verify Certificates",path:'/verify-certificates',icon:<ShieldCheck size={26}/>},
    {name:"Profile",path:'/profile',icon:<User size={26}/>},
    {name:"About",path:'/about',icon:<Info size={26}/>},
  ];

  const onNavInfoClicked=()=>{
    navigate(-1);
  }

  const MakeNavigationAction=()=>{
    let currentPath="/"+window.location.pathname.split('/')[1];
    setSelectedPath(PageNavData.filter((item)=>item.path==currentPath)[0]);
  }

useEffect(() => {
  const debounceTimer = setTimeout(() => {
    const sessionCheck = async () => {
      setMakeLoading(true);
      try {
        const res = await axios.get(`${apiUrl}/api/protect/session-check`, {
          withCredentials: true,
        });
        storeUserData(res.data.user_data);
        setUserData({ ...res.data.user_data, status: true });
      } catch (error) {
        if (error?.response?.status === 401) {
          toast.error(error?.response?.data?.message || "Session expired");
          removeUserData();
          navigate('/');
        }
      } finally {
        setMakeLoading(false);
      }
    };

    const user = getUserData();
    if (user !== false) {
      sessionCheck();
    }

    MakeNavigationAction();

  }, 100);

  return () => clearTimeout(debounceTimer);
}, [location]);


  return (

    <>
    
        <div className=' h-screen flex items-start justify-normal p-3 gap-x-2'>
          
          {/* SideBar */}

        <Sidebar user_data={userData}>
      <NavLink to="/">
      {({ isActive }) => (
        <SidebarItem icon={<Home size={20} />} text="Home" active={isActive} />
      )}
      </NavLink>

      <NavLink to="/courses">
        {({ isActive }) => (
          <SidebarItem icon={<BookOpen size={20} />} text="Courses" active={isActive} />
        )}
      </NavLink>
      
      {userData.status?
      <NavLink to="/submissions">
        {({ isActive }) => (
          <SidebarItem icon={<ClipboardCheck size={20} />} text="Submissions" active={isActive} />
        )}
      </NavLink>:null}

      <NavLink to="/verify-certificates">
        {({ isActive }) => (
          <SidebarItem icon={<ShieldCheck size={20} />} text="Verify" active={isActive} />
        )}
      </NavLink>

      <hr className='py-2 mt-4'/>

      {userData.status && userData.role==="admin"? 
      <NavLink to="/admin">
        {({ isActive }) => (
          <SidebarItem icon={<UserCog size={20} />} text="Admin" active={isActive} />
        )}
      </NavLink>:null}

       {userData.status? 
      <NavLink to="/profile">
        {({ isActive }) => (
          <SidebarItem icon={<User size={20} />} text="Profile" active={isActive} />
        )}
      </NavLink>:null}

      <NavLink to="/about">
        {({ isActive }) => (
          <SidebarItem icon={<Info size={20} />} text="About" active={isActive} />
        )}
      </NavLink>

    </Sidebar>
          
        {/* Pages */}
    
        <div className={`flex-1 p-0 overflow-auto h-full sm:block  ${expanded? 'hidden':'block'}`}>

          <h1 className='flex items-center justify-normal'>{selectedPath.icon}
          <span className={`text-2xl p-1 font-bold text-black cursor-pointer
          ${selectedPath?.subName?'font-medium text-xl':''}
          `} onClick={()=>onNavInfoClicked()}>{selectedPath.name}</span>
          {selectedPath?.subName && (
            <span className=' flex items-center justify-normal text-xl font-semibold text-black capitalize gap-x-1'>
            <ChevronRight size={20}/>
            <span className='whitespace-nowrap overflow-hidden text-ellipsis w-40 sm:w-auto'>
            {selectedPath.subName}  
            </span>
            </span>
          )}
          </h1>

          <div className={`w-full h-screen border overflow-y-auto p-2 rounded-lg`}>
            <Outlet />
          </div>
         
        </div>

        {expanded &&         
        <div className={`w-auto text-justify mt-96 flex -ml-5 items-center justify-center rotate-90 gap-x-1.5 text-2xl sm:hidden`}>
        
        {selectedPath.icon}
        {selectedPath.name}  
  
        </div>
        }

        </div>
        <Loader loading={makeLoading}/>
       </>
  );
}

export default MainLayout;
