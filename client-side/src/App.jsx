import React from 'react'
import LoginRegister from './authPages/LoginRegister.jsx'
import AuthLayout from './authPages/AuthLayout.jsx'

import {Route, Routes} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<AuthLayout/>}>
        <Route path='/login-register' index element={<LoginRegister/>}/>
      </Route>
    </Routes>
    <Toaster position='top-right' reverseOrder={false}/>
    </>

  )
}

export default App