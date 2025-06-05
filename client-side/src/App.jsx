import React from 'react'
import {Route} from 'react-router-dom';
import { Routes } from 'react-router';
import { Toaster } from 'react-hot-toast'
import MainLayout from './clientPages/MainLayout.jsx'
import Home from './clientPages/Home.jsx'
import Courses from './clientPages/Courses.jsx';
import MySubmissions from './clientPages/MySubmissions.jsx';
import Verify from './clientPages/Verify.jsx';
import AuthLayout from './authPages/AuthLayout.jsx'
import Profile from './clientPages/Profile.jsx';
import Help from './clientPages/Help.jsx';
import AdminMainLayout from './adminPages/AdminMainLayout.jsx';
import Dashboard from './adminPages/Dashboard.jsx';
import SelectedCourse from './clientPages/SelectedCourse.jsx';
import ManageUsers from './adminPages/ManageUsers.jsx';
import ManageCourses from './adminPages/ManageCourses.jsx';
import ManageSubmissions from './adminPages/ManageSubmissions.jsx';
import ManageEnrollments from './adminPages/ManageEnrollments.jsx';
import ManageTasks from './adminPages/ManageTasks.jsx';

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<MainLayout/>}>
        <Route index element={<Home/>}/>
        <Route path='/courses' element={<Courses/>}/>
        <Route path='/selected-course/:title' element={<SelectedCourse/>}/>
        <Route path='/submissions' element={<MySubmissions/>}/>
        <Route path='/verify-certificates' element={<Verify/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/help' element={<Help/>}/>
      </Route>

      <Route path='/user-login_register' element={<AuthLayout/>}/>

      <Route path='/admin' element={<AdminMainLayout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path='manage-users' element={<ManageUsers/>}/>
        <Route path='manage-courses' element={<ManageCourses/>}/>
        <Route path='manage-submissions' element={<ManageSubmissions/>}/>
        <Route path='manage-enrollments' element={<ManageEnrollments/>}/>
        <Route path='manage-tasks' element={<ManageTasks/>}/>
      </Route>
    </Routes>
    <Toaster position='top-right' reverseOrder={false}/>
    </>

  )
}

export default App