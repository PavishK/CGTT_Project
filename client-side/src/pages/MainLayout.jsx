import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { getUserData, storeUserData } from '../service/StorageService';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Loader from '../Loader.jsx';
import '../index.css';
import Sidebar, { SidebarItem } from "./SideBar.jsx"

import {
  Home,
  BookOpen,
  ClipboardCheck,
  BadgeCheck,
  ShieldCheck,
  User, 
  HelpCircle,
  UserCog,
} from "lucide-react";

function MainLayout() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: 'gojo', email: 'gojo@gmail.com' ,id:'001',role:'user',status:false});
  const apiUrl = import.meta.env.VITE_SERVER_API;
  const [makeLoading,setMakeLoading]=useState(false);

  const MakeLoading=()=>{
    setMakeLoading(true);
    setTimeout(()=>{setMakeLoading(false)},1000);
  }

  useEffect(() => {

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
        setMakeLoading(false);
      }
    };

    MakeLoading();
    sessionCheck();
    
  }, [apiUrl]);



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

      <NavLink to="/submissions">
        {({ isActive }) => (
          <SidebarItem icon={<ClipboardCheck size={20} />} text="Submissions" active={isActive} />
        )}
      </NavLink>

      <NavLink to="/certificates">
        {({ isActive }) => (
          <SidebarItem icon={<BadgeCheck size={20} />} text="Certificates" active={isActive} />
        )}
      </NavLink>

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

      <NavLink to="/help">
        {({ isActive }) => (
          <SidebarItem icon={<HelpCircle size={20} />} text="Help" active={isActive} />
        )}
      </NavLink>

    </Sidebar>
          
        {/* Pages */}
    
        <div className="flex-1 p-0 overflow-auto h-full">
          <Outlet />
        </div>

    
        </div>
        <Loader loading={makeLoading}/>
       </>
  );
}

export default MainLayout;
