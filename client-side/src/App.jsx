import React from 'react'
import {Route} from 'react-router-dom';
import { Routes } from 'react-router';
import { Toaster } from 'react-hot-toast'
import MainLayout from './pages/MainLayout.jsx'
import Home from './pages/Home.jsx'
import Courses from './pages/Courses.jsx';
import MySubmissions from './pages/MySubmissions.jsx';
import Certificates from './pages/Certificates.jsx';
import Verify from './pages/Verify.jsx';
import AuthLayout from './authPages/AuthLayout.jsx'
import Profile from './pages/Profile.jsx';
import Help from './pages/Help.jsx';
import AdminMainLayout from './adminPages/AdminMainLayout.jsx';
import Dashboard from './adminPages/Dashboard.jsx';

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<MainLayout/>}>
        <Route index element={<Home/>}/>
        <Route path='/courses' element={<Courses/>}/>
        <Route path='/submissions' element={<MySubmissions/>}/>
        <Route path='/certificates' element={<Certificates/>}/>
        <Route path='/verify-certificates' element={<Verify/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/help' element={<Help/>}/>
      </Route>

      <Route path='/user-login_register' element={<AuthLayout/>}/>

      <Route path='/admin' element={<AdminMainLayout/>}>
        <Route index element={<Dashboard/>}/>
      </Route>
    </Routes>
    <Toaster position='top-right' reverseOrder={false}/>
    </>

  )
}

export default App