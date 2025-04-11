import React, { useState } from 'react';
import LoginRegister from './LoginRegister';
import Logo from '../assets/images/form_logo.png';
import TTLogo from '../assets/images/ttlogo.png';
import SchoolIcon from '@mui/icons-material/School';
import '../index.css';

import toast, { Toaster } from 'react-hot-toast';

function AuthLayout() {

  const make=()=>toast.success("Hello",{  duration: 4000,
  });

  return (
    <div className='flex items-start justify-start p-2 sm:p-4 flex-col sm:flex-row gap-x-2 bg-bglight'>
    <div className='w-full h-screen  rounded-xl border-2 border-black hidden sm:flex items-center justify-center flex-col p-2'>

    <img src={TTLogo} className='w-96 rounded-full p-8 top-0 left-0 absolute'/>
    
    <div className='flex items-center justify-center flex-col transition-transform duration-500 ease-in-out hover:-translate-y-3 animate-float mb-14 mt-20'>
    <img src={Logo} onClick={()=>make()}/>
    </div>


    <div className="text-center font-nunito">
  <h2 className="text-2xl font-semibold mb-2 text-textlight">
  <span><SchoolIcon fontSize='large'/></span>Welcome to Training Trains</h2>
  <p className="text-gray-600 text-base leading-relaxed max-w-xl mx-auto ">
    Join our platform to showcase your skills, upload completed tasks, and earn verified certifications. 
    Whether you're a learner or a professional, easily manage your profile, track progress, and download 
    certificates that validate your achievements. Sign in or register now to take the next step in your training journey.
  </p>
</div>

  </div>
    <div className='w-full h-screen  rounded-xl border-2 border-black flex items-center justify-normal sm:justify-center flex-col'>
    <img src={TTLogo} className='w-80 rounded-full  sm:hidden'/>
    <LoginRegister/>
    </div>
    </div>
  )
}

export default AuthLayout