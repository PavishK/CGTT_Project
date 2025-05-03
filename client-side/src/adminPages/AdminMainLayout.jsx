import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import AdminSideBar from './AdminSideBar'
import Loader from '../Loader.jsx';

function AdminMainLayout() {
  const [makeLoading,setMakeLoading]=useState(false);
    const [userData, setUserData] = useState({ name: 'gojo', email: 'gojo@gmail.com' ,id:'001',role:'admin',status:false});

  return (
      <div className=' h-screen flex items-start justify-normal p-3 gap-x-2'>

      {/* Side Bar */}
      <AdminSideBar user_data={userData}/>

      {/* Admin Pages */}
      <div className="flex-1 p-0 overflow-auto h-full">
        <Outlet />
      </div>

      <Loader loading={makeLoading}/>
      </div>
  )
}

export default AdminMainLayout