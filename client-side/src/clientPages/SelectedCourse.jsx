import React, { useEffect, useState, Suspense } from 'react'
import { data, useLocation } from 'react-router-dom'
import Sample from '../assets/images/main_page_image.svg';
import {
  LockKeyhole,
  UnlockKeyhole,
  XSquareIcon,
  UserCheck,
} from 'lucide-react';
import {toast} from 'react-hot-toast';
import axios from 'axios';
import Loader from '../Loader.jsx';
import SelectedTask from './SelectedTask';
import {getUserData} from '../service/StorageService.jsx';
const GenerateCertificate = React.lazy(() => import('../certificate/GenerateCertificate'));

function SelectedCourse() {
    const locationData=useLocation();
    const [courseData,setCourseData]=useState(locationData.state);
    const [courseTasks,setCourseTasks]=useState([]);
    const [makeLoading,setMakeLoading]=useState(false);
    const [selectedTask,setSelectedTask]=useState({selected:false,data:{}});

    const [downloadPopup,setDownloadPopup]=useState(false);
    const [certificateData,setCertificateData]=useState({});
    const [userData,setUserData]=useState({});
    const [verifyName,setVerifyName]=useState("");
    const [SDCertificate,setSDCertificate]=useState(false);

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
      setUserData(getUserData());
      setVerifyName(getUserData().name);
      setCourseData(locationData.state);
      getCourseTasks();
    },[]);

    useEffect(()=>{
      setMakeLoading(true);
      setTimeout(()=>setMakeLoading(false),1000);

    },[selectedTask])

    const onTaskSelected=(data)=>{
      setSelectedTask({selected:true,data:data});
    }

    const onConfirmName=()=>{
      if(verifyName.length==0 || verifyName.length<4)
        toast.error("Verify Name field must not be empty and contains full name.");
      else{
        setDownloadPopup(false);
        setSDCertificate(true);
      }

    }

    const downloadHandler=async()=>{
      if(courseData.course_completed){
        if(!userData)
          toast.error("Please login to download certificate.");
        else{
          setMakeLoading(true);
          try {
            const res=await axios.post(apiUrl+'/api/course/get-certificate-data',{user_id:userData._id,course_id:courseData.id});
            setCertificateData(res.data.data);
            console.log(res.data.data);
            setDownloadPopup(true);
          } catch (error) {
            toast.error("Unable to download certificate.");
          } finally{
            setMakeLoading(false);
          }
        }
      }
      else
        toast.error("Please complete the tasks!");
    }

  return (
  <>
    <div className='w-full flex item-start justify-normal flex-col'>
      <div className='h-full flex items-start justify-normal flex-col'>
        <img src={Sample} className='h-60 w-full object-cover rounded-lg '/>
        <div className='p-1 w-full flex items-start justify-between flex-col sm:flex-row gap-y-1'>
        <div className='leading-6'>
        <h1 className='capitalize text-2xl font-semibold'>{courseData.title}</h1>
        <p>{new Date(courseData.created_at).toDateString()}</p>
        </div>
        <button className={`flex items-center justify-normal gap-x-1 text-xl transition-transform ease-in border p-3 rounded-lg font-semibold w-full sm:w-fit hover:scale-105 cursor-pointer`} onClick={downloadHandler}>
        {courseData.course_completed?
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

    {downloadPopup?(
        <div className='fixed items-center justify-center w-full h-full transition-opacity duration-300 bg-black/70 rounded-lg'>
        <center className=''>
      <div className='mr-20 sm:mr-0 flex items-start justify-normal flex-col text-lg gap-y-2 w-fit bg-white p-3 border rounded-lg mt-52'>
      <div className='flex items-start justify-between w-full'>
        <div className='flex items-start justify-normal gap-x-1 text-xl font-bold text-blue-500'>
          <UserCheck size={25}/>
          <h1>Verify Name</h1>
        </div>
      <XSquareIcon className='self-end text-red-500 cursor-pointer' size={28} onClick={()=>setDownloadPopup(false)}/>
      </div>
        <p className='font-semibold text-start mt-3'>Verify the name below before <br/>downloading the certificate.</p>
        <input className='w-full p-2 border rounded-lg text-lg uppercase' value={verifyName} name='name' onChange={(e)=>setVerifyName(e.target.value)} />
        <button className='font-bold bg-blue-500 text-white p-2 rounded-lg self-center cursor-pointer mt-2' onClick={onConfirmName}>Confirm Name</button>
      </div>
        </center>
        </div> 
    ):null}

    {SDCertificate?(
        <div className='fixed items-center justify-center w-full h-full transition-opacity duration-300 bg-black/70 rounded-lg overflow-auto p-2'>
        <center>
      <div className=' mr-20 sm:mr-0 flex items-start justify-normal flex-col text-lg gap-y-2 w-fit bg-white p-3 border rounded-lg mt-20 '>
      <div className='flex items-start justify-between w-full pr-20 sm:pr-0'>
        <div className='flex items-start justify-normal gap-x-1 text-xl font-bold text-blue-500'>
          <UserCheck size={25}/>
          <h1>Verify / Download Certificate</h1>
        </div>
      <XSquareIcon className='self-end text-red-500 cursor-pointer' size={28} onClick={()=>setSDCertificate(false)}/>
      </div>
      <div className='mr-20 sm:mr-0'>
        <Suspense fallback={<div className='text-xl animate-pulse flex items-center justify-center w-full h-full'>Loading certificate...</div>}>
        <GenerateCertificate props={{...certificateData,name:verifyName,title:courseData.title}} close={()=>setSDCertificate(false)}/>
        </Suspense>
      </div>
      </div>
        </center>
        </div> 
    ):null}
      <Loader loading={makeLoading}/>
    </div>
  </>
  )
}

export default SelectedCourse
