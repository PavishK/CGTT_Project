import React, { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import {getUserData} from '../service/StorageService.jsx';
import Loader from '../Loader.jsx';
import {
  File
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function MySubmissions() {
  const [submissionDatas,setSubmissionsDatas]=useState([]);
  const [makeLoading,setMakeLoading]=useState(false);
  const [userData,setUserData]=useState({});
  const apiUrl=import.meta.env.VITE_SERVER_API;
  const statusColor={pending:"text-yellow-500",rejected:"text-red-500",accepted:"text-green-500"}
  const navigate=useNavigate(null);


  useEffect(()=>{
    const fetchSubmissions=async()=>{
      setMakeLoading(true);
      try {
        const res=await axios.get(`${apiUrl}/api/task/get-user-submissions-data/${getUserData()._id}`);
        console.log(res.data.data);
        setSubmissionsDatas(res.data.data);
      } catch (error) {
        toast.error("Unable to get submissions data.");
      } finally{
        setMakeLoading(false);
      }
    }

    setUserData(getUserData());
    fetchSubmissions();
  },[apiUrl]);

  const onFileOpen=(url)=>{
    const features=`width=500,height=500,resizable=yes,scrollbars=yes`;
    const newWindow=window.open(url,"Submited DOC |",features);

    if(newWindow)
      newWindow.document.title="Self 😉";
    else
      toast.error("Popup blocked. Please allow popup for this site.")
  }

  return (
    <>
    {submissionDatas.length==0?(
      <div className='flex items-start justify-normal flex-col'>
        <h1>No Submissions yet☺️.</h1>
      </div>
    ):(

      <div className='flex items-start justify-normal flex-col gap-y-4 w-full p-1.5 '>
      {submissionDatas.map((val,i)=>(
      <div className='flex border rounded-lg w-full p-2 text-xl items-start justify-between gap-x-6 overflow-x-scroll flex-wrap sm:flex-nowrap gap-y-0.5' key={i}>
        <p className='w-full whitespace-nowrap capitalize sm:border-r sm:pr-2 cursor-pointer' onClick={()=>navigate('/courses')}>{val.course_name}</p>
        <p className='w-full whitespace-nowrap capitalize sm:border-r sm:pr-2'>{val.title}</p>
        <p className='w-full whitespace-nowrap capitalize sm:border-r am:pr-2'>{new Date(val.submited_at).toDateString()}</p>
        <p className={`w-full whitespace-nowrap capitalize sm:border-r sm:pr-2  ${statusColor[val.status]}`}>{val.status}</p>
        <p onClick={()=>onFileOpen(val.file_url)} className='text-blue-500 cursor-pointer flex items-start justify-normal gap-x-0.5 w-full'>
        <File size={25}/>
        <span className='line-clamp-1 w-44 underline'>{val.file_url}</span></p>
      </div>
      ))}      
      </div>
    )}
      <Loader loading={makeLoading}/>
    </>
  )
}

export default MySubmissions