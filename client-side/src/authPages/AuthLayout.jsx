import React, { useState } from 'react';
import LoginRegister from './LoginRegister';
import Logo from '../assets/images/form_logo.png';
import TTLogo from '../assets/images/ttlogo.png';
import Loader from '../Loader.jsx';
import '../index.css';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap
} from 'lucide-react';

import toast, { Toaster } from 'react-hot-toast';

function AuthLayout() {
  const navogate=useNavigate(null);
  const [makeLoading,setMakeLoading]=useState(false);
  const make=()=>toast.success("Hello, Welcom to Training Trains!👋",{  duration: 2000,
  });

  useState(()=>{

    const MakeLoad=()=>{
      setMakeLoading(true);
      setTimeout(()=>{setMakeLoading(false)},1100);
    }

    MakeLoad();

  },[makeLoading])

  return (
    <>
    <div className='flex items-start justify-start p-2 sm:p-4 flex-col sm:flex-row gap-x-2 bg-bglight'>
    <div className='w-full h-screen  rounded-xl border hidden sm:flex items-center justify-center flex-col p-2'>

 <div className="relative w-full h-full">
  <motion.div
    className="absolute top-0 left-0"
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
  >
    <img
      src={TTLogo}
      className="w-96 rounded-full p-8 cursor-pointer"
      title="Go Back To Home"
      onClick={() => navogate('/')}
      alt="Logo"
    />
  </motion.div>
</div>

    
    <div className='flex items-center justify-center flex-col transition-transform duration-500 ease-in-out hover:-translate-y-3 animate-float mb-14 mt-20'>
      
      <motion.img
        drag
        whileTap={{ scale: 1.01 }}
        src={Logo}
        alt="Logo"
        onClick={()=>make()}
      />
    </div>


    <div className="text-center font-nunito">
  <h2 className="text-2xl font-semibold mb-2 text-textlight flex items-start justify-center gap-x-1.5">
  <span><GraduationCap size={30}/></span>Welcome to Training Trains</h2>
  <p className="text-gray-600 text-base leading-relaxed max-w-xl mx-auto ">
    Join our platform to showcase your skills, upload completed tasks, and earn verified certifications. 
    Whether you're a learner or a professional, easily manage your profile, track progress, and download 
    certificates that validate your achievements. Sign in or register now to take the next step in your training journey.
  </p>
</div>

  </div>
    <div className='w-full h-screen  rounded-xl border border-black flex items-center justify-normal gap-y-1 sm:gap-y-0 sm:justify-center flex-col'>
    <motion.div
        initial={{ y: -100, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}     
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-80 rounded-full  sm:hidden cursor-pointer hover:scale-100">
        <img src={TTLogo} className='w-80 rounded-full  sm:hidden cursor-pointer hover:scale-100' title='Go Back To Home' onClick={()=>navogate('/')}/>
        </motion.div>
    <LoginRegister/>
    </div>
    </div>

    <Loader loading={makeLoading}/>
    </>
  )
}

export default AuthLayout