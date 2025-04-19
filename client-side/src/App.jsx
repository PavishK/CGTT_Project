import React from 'react'
import {Route, Routes} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import MainLayout from './pages/MainLayout.jsx'
import Home from './pages/Home.jsx'
import AuthLayout from './authPages/AuthLayout.jsx'

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<MainLayout/>}>
        <Route path='/home' index element={<Home/>}/>
      </Route>
      <Route path='/user-login_register' element={<AuthLayout/>}/>
    </Routes>
    <Toaster position='top-right' reverseOrder={false}/>
    </>

  )
}

export default App