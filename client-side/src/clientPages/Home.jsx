import React,{useEffect} from 'react'
import MainImage from '../assets/images/main_page_image.svg'
import {useSelector} from 'react-redux';
import {
  GraduationCap,
  TrendingUp,
  Medal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Home() {
  const navigate=useNavigate(null);
  const expanded=useSelector((state)=>state.expanded);


  return (
    <div className={`flex items-start justify-start flex-col px-0.5 sm:block`}>

      <div className='flex items-center justify-normal gap-x-2 sm:flex-row flex-col-reverse mt-10'>

      <div className='flex-1/2 mt-10 p-2'>
          <div className='flex items-start justify-normal flex-col gap-y-4'>
            <h3 className='font-bold flex items-center justify-normal gap-x-1'>
            <div className='w-3 h-3 bg-black rounded-full'></div>
            Unlock Your Potential</h3>
            <h1 className='text-5xl sm:text-6xl font-medium text-justify'><b>Improve</b> your <br></br>skill easily</h1>
            <p className='mt-2'>Complete tasks, build skills, and get recognized! Simply upload your work, get it verified, and receive your certificate instantly. 
            Our platform helps you improve your skills and showcase your achievements with confidence. Validate your progress anytime, anywhere — your journey to success starts here.</p>
          </div>
          <div className='flex items-center justify-normal gap-x-4 mt-8'>
            <button className='bg-black p-3 rounded-lg text-white transition-transform ease-in-out hover:scale-105 hover:cursor-pointer' onClick={()=>navigate('/courses')}>Explore Course</button>
            <button className='border-2 text-black border-black p-2.5  rounded-lg transition-transform ease-in-out hover:scale-105 hover:cursor-pointer'>Learn More</button>
          </div>
        </div>

        <motion.div
        initial={{ y: -100, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}     
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex-1/2"
      >
          <img src={MainImage} className='w-full h-full'/>
      </motion.div>

      </div>

      <div className='flex items-center justify-center sm:justify-evenly mt-6 flex-col sm:flex-row w-full gap-y-5 p-2'>
        <div className='flex items-center justify-center flex-col border w-52 p-2 rounded-lg transition-all delay-75 ease-in hover:bg-gray-200 hover:scale-105 hover:border-none'>
          <GraduationCap size={65}/>
          <h1 className='text-xl font-bold'>Learn</h1>
        </div>
        <div className='flex items-center justify-center flex-col border w-52 p-2 rounded-lg transition-all delay-75 ease-in hover:bg-gray-200 hover:scale-105 hover:border-none'>
          <TrendingUp size={65}/>
          <h1 className='text-xl font-bold'>Grow</h1>
        </div>
        <div className='flex items-center justify-center flex-col border w-52 p-2 rounded-lg transition-all delay-75 ease-in hover:bg-gray-200 hover:scale-105 hover:border-none'>
          <Medal size={65}/>
          <h1 className='text-xl font-bold'>Succeed</h1>
        </div>
      </div>

    </div>
  )
}

export default Home