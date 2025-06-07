import React, { useEffect, useState } from 'react';
import {
  Check,
  Trash2,
  GraduationCap,
  XSquareIcon,
  ListCheck,
} from 'lucide-react';
import axios from 'axios';
import { getUserData } from '../service/StorageService';
import toast from 'react-hot-toast';
import Loader from '../Loader.jsx';

function ManageEnrollments() {
  const [userData,setUserData]=useState(getUserData() || {});
  const [enrollmentDatas,setEnrollmentDatas]=useState([]);
  const [makeLoading,setMakeLoading]=useState(false);

  const [deleteEnrollmentData,setDeleteEnrollmentData]=useState({});
  const [confirmPopupD,setConfirmPopupD]=useState(false);

  const [allowPopup,setAllowPopup]=useState(false);
  const [allowPopupData,setAllowPopupData]=useState({});

  const [confirmationPopup,setConfirmationPopup]=useState(false);
  const [completionData,setCompletionData]=useState({});

  const apiUrl=import.meta.env.VITE_SERVER_API;

  useEffect(()=>{
    const fetchEnrollmentDatas=async()=>{
      setMakeLoading(true);
      try {
        const res=await axios.get(`${apiUrl}/api/admin/get-enrollments-data/${userData._id}/${userData.email}`);
        setEnrollmentDatas(res.data.data);
        console.log(res.data.data);
      } catch (error) {
       toast.error("Unable to load enrollment datas.");
      } finally{
        setMakeLoading(false);
      }
    }

    setUserData(getUserData());
    fetchEnrollmentDatas();
  },[apiUrl]);

  // Delete Manager

  const confirmPopup=(data)=>{
    setConfirmPopupD(true);
    setDeleteEnrollmentData(data);
  }

  const DeleteEnrollmentData=async()=>{
    setMakeLoading(true);
    try {
      await axios.delete(`${apiUrl}/api/admin/delete-enrollment-data/${deleteEnrollmentData.id}`);
      setEnrollmentDatas(enrollmentDatas.filter((val)=>val.id!=deleteEnrollmentData.id));
      toast.success("Enrollment data deleted successfully.");
    } catch (error) {
      console.log(error)
    } finally{
      setMakeLoading(false);
      setConfirmPopupD(false);
    }
  }

  // Allow Enrollment

  const allowConfirmPopup=(data,i)=>{
    setAllowPopup(true);
    setAllowPopupData({...data,key:i});
  }

  const AllowEnrollment=async()=>{
    setMakeLoading(true);
    try {
      await axios.put(`${apiUrl}/api/admin/accept-enrollment-data`,{id:allowPopupData.id});
      const updatedData=[...enrollmentDatas];
      updatedData[allowPopupData.key].enrollment_status=true;
      setEnrollmentDatas(updatedData);
      toast.success("Enrollment data updated successfully.");
    } catch (error) {
      console.log(error);
    } finally{
      setMakeLoading(false);
      setAllowPopup(false);
    }
  }

  //Completion Manager

  const ConfirmationPopup=(data,i)=>{
    setConfirmationPopup(true);
    setCompletionData({...data,key:i});
  }

  const CompletionCourse=async()=>{
    try {
      await axios.put(`${apiUrl}/api/admin/allow-course-completion`,{id:completionData.id});
      const updatedData=[...enrollmentDatas];
      updatedData[completionData.key].course_completed=true;
      setEnrollmentDatas([...updatedData]);
      toast.success("Enrollment data updated successfully.");
    } catch (error) {
      toast.error("Unable to update enrollment data.");
    } finally{
      setMakeLoading(false);
      setConfirmationPopup(false);
    }
  }
  return (
    <>
    <div className='flex items-start justify-normal overflow-x-scroll w-full p-2 rounded-lg'>
      {/* <div className={`text-xl font-semibold ${usersData.length>0?'hidden':'block'}`}>
        <h1>No users other then you☺️.</h1>
      </div> */}
      <table className={`w-full`}>
      <tbody>
          <tr className='flex items-start justify-between border-b p-2 font-bold gap-x-8 text-lg'>
            <td>ID</td>
            <td>USERNAME</td>
            <td>COURSE</td>
            <td>ENROLLED</td>
            <td>MANAGE</td>
          </tr>
      </tbody>
        
        <tbody className='flex items-start justify-normal flex-col gap-y-2 w-full'>
        {enrollmentDatas.map((val,i)=>(
          <tr className='w-full flex items-start justify-between text-center text-lg p-1.5 gap-x-8 border-b' key={i}>
          <td>{val.id}</td>
          <td>{val.name}</td>
          <td>{val.title}</td>
          <td className={`${val.enrollment_status?'text-green-500':'text-yellow-500'} font-semibold`}>
          {val.enrollment_status?"ENROLLED":"REQUESTED"}
          </td>
          <td>
            <div className={`flex items-start justify-normal gap-x-1 ${val.course_completed?'hidden':'block'}`}>
              <button className={`bg-green-500 p-1.5 text-white rounded-lg cursor-pointer ${val.enrollment_status?'hidden':'block'}`} onClick={()=>allowConfirmPopup(val,i)}><Check size={28}/></button>
              <button className={`p-1.5 text-white bg-black rounded-lg cursor-pointer ${!val.enrollment_status?'hidden':'block'}`} onClick={()=>ConfirmationPopup(val,i)}><GraduationCap size={28}/></button>
              <button className='bg-red-500 p-1.5 text-white rounded-lg cursor-pointer' onClick={()=>confirmPopup(val)}><Trash2 size={28}/></button>
            </div>
            <div className={`font-bold text-green-500 uppercase ${!val.course_completed?'hidden':'block'}`}>
            Completed
            </div>
          </td>
          </tr>
        ))}
        </tbody>
      </table>

      {/* Delete Enrollment */}

      {confirmPopupD?(
      <div className='fixed flex items-center justify-center w-full h-full transition-opacity duration-300 bg-black/70 rounded-lg'>
      <div className='mr-20 sm:mr-0 flex items-start justify-normal flex-col text-lg gap-y-2 w-fit bg-white p-3 border rounded-lg'>
      <XSquareIcon className='self-end text-red-500 cursor-pointer' size={28} onClick={()=>setConfirmPopupD(false)}/>
        <p className='font-semibold'>Click <span className='text-green-500'>Confirm</span> to remove "{deleteEnrollmentData.name}" from <br/> "{deleteEnrollmentData.title}" course.</p>
        <button className='font-bold bg-green-500 text-white p-2 rounded-lg self-center cursor-pointer' onClick={DeleteEnrollmentData}>Confirm</button>
      </div>
      </div> 
      ):null}

      {/* Allow Enrollment */}
      
      {allowPopup?(
      <div className='fixed flex items-center justify-center w-full h-full transition-opacity duration-300 bg-black/70 rounded-lg'>
      <div className='mr-20 sm:mr-0 flex items-start justify-normal flex-col text-lg gap-y-2 w-fit bg-white p-3 border rounded-lg'>
      <XSquareIcon className='self-end text-red-500 cursor-pointer' size={28} onClick={()=>setAllowPopup(false)}/>
        <p className='font-semibold'>Click <span className='text-green-500'>Confirm</span> to enroll, "{allowPopupData.name}", in <br/> "{allowPopupData.title}" course.</p>
        <button className='font-bold bg-green-500 text-white p-2 rounded-lg self-center cursor-pointer' onClick={AllowEnrollment}>Confirm</button>
      </div>
      </div> 
      ):null}

      {/* Completion  */}
      
      {confirmationPopup?(
      <div className='fixed flex items-center justify-center w-full h-full transition-opacity duration-300 bg-black/70 rounded-lg'>
      <div className='mr-20 sm:mr-0 flex items-start justify-normal flex-col text-lg gap-y-2 w-fit bg-white p-3 border rounded-lg'>
      <div className='flex items-start justify-between w-full'>
      <div className='flex items-start justify-normal gap-x-0.5'>
      <ListCheck size={28} className='text-green-500'/>
      <span className='text-xl font-bold text-green-500'>Provide Certificate</span>
      </div>
      <XSquareIcon className='self-end text-red-500 cursor-pointer' size={28} onClick={()=>setConfirmationPopup(false)}/>
      </div>
        <p className='font-semibold'>Click <span className='text-green-500'>Confirm</span> to approve course completion for "{completionData.name}" has <br/> completed the course titled "{completionData.title}".</p>
        <button className='font-bold bg-green-500 text-white p-2 rounded-lg self-center cursor-pointer' onClick={CompletionCourse}>Confirm</button>
      </div>
      </div> 
      ):null}
    </div>


      <Loader loading={makeLoading}/>     
    </>
  )
}

export default ManageEnrollments