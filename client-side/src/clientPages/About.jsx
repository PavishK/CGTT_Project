import React, {useEffect, useState} from 'react'
import {
  Info,
  BadgeCheck,
} from 'lucide-react';
import ImageO from '../assets/images/about_img.png';
import './StylePages.css';

function About() {

  const [MotionDiv,setMotionDiv]=useState(null);

    useEffect(()=>{
      import('framer-motion').then((mod)=>{
        setMotionDiv(()=>mod.motion.div);
      })
    },[]);
    
    if(!MotionDiv) return null;

  return (

    <div className='flex items-start justify-start flex-col p-1 w-full'>
    <div className='flex items-center justify-normal p-3 w-full bg-gray-50 pb-8'>
    <MotionDiv
    initial={{ x: -800, opacity: 0 }} 
    animate={{ x: 0, opacity: 1 }}     
    transition={{ duration: 1.5, ease: 'easeOut' }}
    className='mt-6 flex items-center justify-normal text-4xl sm:text-5xl font-bold w-full'>
      <h1 className='flex gap-x-3.5 flex-wrap'><span><u className='underline-offset-4 decoration-black'>A</u>bout Us</span>-<span className=' bg-gradient-to-r from-green-500 via-blue-500 to-red-500 text-transparent bg-clip-text flex items-start justify-normal'>
      Training Trains </span></h1>
    </MotionDiv>
    </div>
    <div className='items-center justify-center flex w-full flex-col '>
      <div className='flex items-end justify-normal w-full sm:flex-row flex-col p-2'>
          <MotionDiv
          initial={{ y: 300, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}     
          transition={{ duration: 1, ease: 'easeOut' }}
          className="flex-1/2 sm:mt-0 -mt-28">
          <img src={ImageO} className='h-96 w-full object-contain'/>
          </MotionDiv>
      

          <MotionDiv
          initial={{ x: 300, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}     
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="flex-1/2">
          <p className='text-lg text-justify'>At Training Trains, we are a dynamic ISO‑certified startup and government-recognized software development, 
          IT consulting, and training institute based in Erode. Our mission is to bridge the gap between academic learning and practical application by offering immersive inplant training, 
          internships, live projects, and comprehensive placement assistance.</p>
          <button className='p-2.5 border mt-4 cursor-pointer bg-black text-lg text-white rounded-lg'
          onClick={()=>{window.open('https://trainingtrains.com/','_self')}}
          >
          Learn more
          </button>
        </MotionDiv>
      </div>
    </div>
    <MotionDiv
    initial={{ x: 1000, opacity: 0, rotate:'200deg' }} 
    animate={{ x: 0, opacity: 1, rotate:'360deg' }}     
    transition={{ duration: 1.8, ease: 'easeOut' }} 
     className='border-t mt-16'>
      <h1 className='p-2 mt-2 text-xl font-bold bg-gradient-to-br from-black via-gray-500 to-white text-transparent bg-clip-text '>Website created by
      <u 
      className='ml-1.5 text-blue-500 cursor-pointer decoration-transparent hover:decoration-black hover:underline-offset-2 text-2xl font-name'
      onClick={() => window.open("https://personal-portfolio-rdxc.onrender.com", "_blank", "width=900,height=800")}
      >PC</u>.</h1>
    </MotionDiv>

    <div className='self-end border-t w-full mt-10 text-center p-2 text-sm'>
    <p>@ 2025 Training Trains, all rights reserved.</p>
    </div>
  </div>
  )
}

export default About;