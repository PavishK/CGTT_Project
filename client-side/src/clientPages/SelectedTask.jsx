import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  XOctagon,
  XSquareIcon,
  Info
} from 'lucide-react';
import {getUserData} from '../service/StorageService';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import Loader from '../Loader.jsx';

function SelectedTask({data, close}) {
  const [userData,setUserData]=useState({});
  const [fileLink,setFileLink]=useState('');
  const [makeLoading,setMakeLoading]=useState(false);
  const [submitedData,setSubmitedData]=useState({flag:false});
  const [rejectPopup,setRejectPopup]=useState(false);

  const apiUrl=import.meta.env.VITE_SERVER_API;
  const statusColor={pending:"text-yellow-500",rejected:"text-red-500",accepted:"text-green-500"}

  useEffect(()=>{
    const fetchSubmitedTask=async()=>{
      setMakeLoading(true);
      try {
        const res=await axios.get(`${apiUrl}/api/task/get-submited-task/${getUserData()._id}/${data.id}`);
        setSubmitedData({...res.data.data[0],flag:true});
        setFileLink(res.data.data[0].file_url);
        if(res.data.data.length==0){
          setSubmitedData({flag:false});
          setFileLink('');
        }
      } catch (error) {
          setSubmitedData({flag:false});
          setFileLink('');
      } finally{
        setMakeLoading(false);
      }
    }
  setUserData(getUserData());
  fetchSubmitedTask();
  },[]);

const onSubmitTask=async()=>{
    setMakeLoading(true);
     try {
          await axios.post(apiUrl+"/api/task/submit-course-task",{user_id:userData._id,task_id:data.id,fileLink})
          toast.success("Submited successfully!");
          setSubmitedData({flag:true,status:"pending"});
      } catch (error) {
          toast.error("Unable to submit!");
      } finally{
          setMakeLoading(false);
      }
  }

  const checkURL=()=>{
    try {
      new URL(fileLink);
      return true;
    } catch (_) {
      return false;
    }
  }

  const onSubmitHandler=async()=>{
    const pattern = /^https?:\/\/.+\/.+\.(pdf|jpg|jpeg|png|docx|xlsx|txt|zip|mp4|mp3)$/i;
  
    if((fileLink.trim())===''){
      toast.error("Please provide file link.");
    }
    else if(!checkURL()){
      toast.error("Please provide valid file url.");
    }
    else{
    setMakeLoading(true);
    try {
      const res=await axios.get(fileLink.trim());
      if(res.status==200){
        onSubmitTask();
      }    
    } catch (error) {
      toast("Please provide public access to the file.",{icon:<Info size={28} className='text-blue-500'/>})
    } finally{
      setMakeLoading(false);
    }
  }
}

  const onUnSubmitTask=async()=>{
    setMakeLoading(true);
    try {
      await axios.delete(`${apiUrl}/api/task/delete-submited-task/${submitedData.id}`);
      setSubmitedData({flage:false});
      toast.success("Submit data has been deleted.")
    } catch (error) {
      toast.error("Unable to Unsubmit.");
    } finally{
      setMakeLoading(false);
    }
  }

  return (
    <div className='w-full'>
      <div className='w-full p-2 mt-3'>
        <div className='border rounded-lg w-full h-fit flex items-start justify-normal flex-col'>
        <div className='leading-6 p-2 flex items-start justify-normal flex-col'>
        <div className='flex items-center justify-normal gap-x-0.5 pb-2 hover:underline cursor-pointer' onClick={close}>
          <ArrowLeft/>
          <h2>Back to tasks</h2>
        </div>
          <h1 className='text-2xl font-semibold capitalize'>{data.title}</h1>
          <p>{new Date(data.created_at).toDateString()}</p>
        </div>
        <hr className='w-full'/>
        <div className='flex items-start justify-normal flex-col w-full'>
          <p className='text-lg p-2 mt-1'>{data.description}</p>
          <div className='w-full flex items-start justify-between flex-col sm:flex-row gap-y-3 p-2'>
           <div className='w-full sm:w-sm p-4 font-semibold rounded-lg text-lg border flex items-start justify-normal sm:gap-x-1.5 sm:flex-row flex-col gap-y-1'>
            <label className='whitespace-nowrap'>File link:</label>
            <input type='text' disabled={submitedData.flag} value={fileLink} name='fileLink' placeholder='Past the file link here.' className={`${submitedData.status?'text-blue-500 underline overflow-auto':''} cursor-auto h-8 w-fit rounded-lg text-lg `} onChange={(e)=>setFileLink(e.target.value)} />
           </div>
           {submitedData.flag && (
            <div className='flex items-center justify-normal gap-y-0.5 flex-col text-lg w-full'>
              <div className='flex items-center justify-normal gap-x-1'>
              Submit status: 
              <b className={`${statusColor[submitedData.status]} capitalize`}>{submitedData.status}</b>
              </div>
                
              {submitedData.status==='rejected' &&
              (<div className='text-lg text-blue-500 underline cursor-pointer' onClick={()=>setRejectPopup(true)}>Click here to see reason</div>)}
            </div>
           )}
  
           {submitedData.flag?(
            <button className='w-full sm:w-sm p-4 font-bold rounded-lg text-lg border cursor-pointer' onClick={onUnSubmitTask}>Unsubmit</button>
           ):(
            <button className='w-full sm:w-sm p-4 font-bold rounded-lg text-lg border bg-black text-white cursor-pointer' onClick={onSubmitHandler}>Submit</button>
           )}
          </div>
        </div> 
              {rejectPopup?(
        <div className='fixed items-center justify-center w-full h-full transition-opacity duration-300 rounded-lg overflow-auto p-2 left-0 '>
        <center>
      <div className=' mr-0 flex items-start justify-normal flex-col text-lg gap-y-2 w-fit bg-white p-3 border rounded-lg '>
      <div className='flex items-start justify-between w-full'>
        <div className='flex items-start justify-normal gap-x-1 text-xl font-bold text-red-500'>
          <XOctagon size={25}/>
          <h1>Rejected Reason</h1>
        </div>
      <XSquareIcon className='self-end text-red-500 cursor-pointer' size={28} onClick={()=>setRejectPopup(false)}/>
      </div>
      <hr className='w-full'/>
      <div className='sm:w-80 min-w-40 text-justify h-40 overflow-auto cursor-all-scroll'>
     {submitedData.reason || "No reason specified."}
     </div>
      <hr className='w-full'/>
      <div className='text-lg font-semibold text-gray-500'>
        Note: Please unsubmit and resubmit the file link.
      </div>
      </div>
        </center>
        </div> 
    ):null} 
        </div>
        
      </div>
      <Loader loading={makeLoading}/>
    </div>
  )
}

export default SelectedTask