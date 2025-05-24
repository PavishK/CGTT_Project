import React, { useEffect, useState } from 'react'
import { data, useLocation } from 'react-router-dom'
import Sample from '../assets/images/main_page_image.svg';
import {
  LockKeyhole,
  UnlockKeyhole
} from 'lucide-react';
import {toast} from 'react-hot-toast';
import axios from 'axios';
import Loader from '../Loader.jsx';
import SelectedTask from './SelectedTask';

function SelectedCourse() {
    const locationData=useLocation();
    const [courseData,setCourseData]=useState(locationData.state);
    const [downloadable,setDownloadable]=useState(false);
    const [courseTasks,setCourseTasks]=useState([]);
    const [makeLoading,setMakeLoading]=useState(false);
    const [selectedTask,setSelectedTask]=useState({selected:false,data:{}});
    const apiUrl=import.meta.env.VITE_SERVER_API;

    useState(()=>{
      const getCourseTasks=async()=>{
        setMakeLoading(true);
        try {
          const res=await axios.get(`${apiUrl}/api/task/get-course-tasks/${courseData.id}`);
          setCourseTasks(res.data);
          setMakeLoading(false);
        } catch (error) {
          toast.error("Unable to load course tasks.");
          setMakeLoading(false);
        }
      }
      getCourseTasks();
    },[]);

    useEffect(()=>{
      setMakeLoading(true);
      setTimeout(()=>setMakeLoading(false),1000);

    },[selectedTask])

    const onTaskSelected=(data)=>{
      setSelectedTask({selected:true,data:data});
    }

    const downloadHandler=()=>{
      if(downloadable)
        toast.success("Download started!");
      else
        toast.error("Please complete the tasks!");
    }

  return (
    <div className='w-full'>
      <div className='h-full flex items-start justify-normal flex-col'>
        <img src={Sample} className='h-60 w-full object-cover rounded-lg '/>
        <div className='p-1 w-full flex items-start justify-between flex-col sm:flex-row gap-y-1'>
        <div className='leading-6'>
        <h1 className='capitalize text-2xl font-semibold'>{courseData.title}</h1>
        <p>{new Date(courseData.created_at).toDateString()}</p>
        </div>
        <button className={`flex items-center justify-normal gap-x-1 text-xl transition-transform ease-in border p-3 rounded-lg font-semibold w-full sm:w-fit hover:scale-105 cursor-pointer`} onClick={downloadHandler}>
        {downloadable?
          <UnlockKeyhole className={`bg-green-500 p-1 rounded-full text-white`} size={30}/>
        :
          <LockKeyhole className={`bg-red-500 p-1 rounded-full text-white`} size={30}/>
        }
        Download Certificate
        </button>
        </div>
        <hr className='w-full mt-1'/>
      </div>

      <div className={`w-full p-2 mt-3 flex items-center justify-normal flex-col-reverse gap-y-3.5
      ${courseTasks.length===0 || selectedTask.selected?'hidden':'block'}
      `}>
      {courseTasks.map((val,i)=>(
        <div className='border rounded-lg w-full h-fit flex items-start justify-normal flex-col cursor-pointer' key={i} onClick={()=>onTaskSelected(val)}>
        <div className='leading-6 p-2'>
          <h1 className='text-2xl font-semibold capitalize'>{val.title}</h1>
          <p>{new Date(val.created_at).toDateString()}</p>
        </div>
        <hr className='w-full'/>
        <div className='flex items-start justify-normal flex-col'>
          <p className='text-lg p-2 mt-1 line-clamp-2'>{val.description}</p>
        </div>  
        </div>
      ))}
      </div>

      <div className={`${selectedTask.selected?'block':'hidden'}`}>
      <SelectedTask data={selectedTask.data} close={()=>setSelectedTask({selected:false,data:selectedTask.data})}/>
      </div>

      <Loader loading={makeLoading}/>
    </div>
  )
}

export default SelectedCourse
