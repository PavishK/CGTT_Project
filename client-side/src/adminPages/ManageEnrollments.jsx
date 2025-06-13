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
      } catch (error) {
       toast.error("Session expired. Please login.");
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

      {/* Remove Enrollment */}
      {confirmPopupD && (
        <div className="fixed top-0 left-0 z-[9999] w-screen h-screen flex items-center justify-center bg-black/70">
          <div className="w-[90%] max-w-md bg-white border rounded-lg p-4 shadow-lg relative">
            <XSquareIcon
              className="absolute top-2 right-2 text-red-500 cursor-pointer"
              size={28}
              onClick={() => setConfirmPopupD(false)}
            />
            <p className="font-semibold mt-6">
              Click <span className="text-green-500">Confirm</span> to remove "<b>{deleteEnrollmentData.name}</b>" from
              <br /> "<b>{deleteEnrollmentData.title}</b>" course.
            </p>
            <button
              className="mt-4 w-full font-bold bg-green-500 text-white p-2 rounded-lg cursor-pointer"
              onClick={DeleteEnrollmentData}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Allow Enrollment */}
      {allowPopup && (
        <div className="fixed top-0 left-0 z-[9999] w-screen h-screen flex items-center justify-center bg-black/70">
          <div className="w-[90%] max-w-md bg-white border rounded-lg p-4 shadow-lg relative">
            <XSquareIcon
              className="absolute top-2 right-2 text-red-500 cursor-pointer"
              size={28}
              onClick={() => setAllowPopup(false)}
            />
            <p className="font-semibold mt-6">
              Click <span className="text-green-500">Confirm</span> to enroll "<b>{allowPopupData.name}</b>" in
              <br /> "<b>{allowPopupData.title}</b>" course.
            </p>
            <button
              className="mt-4 w-full font-bold bg-green-500 text-white p-2 rounded-lg cursor-pointer"
              onClick={AllowEnrollment}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Course Completion */}
      {confirmationPopup && (
        <div className="fixed top-0 left-0 z-[9999] w-screen h-screen flex items-center justify-center bg-black/70">
          <div className="w-[90%] max-w-md bg-white border rounded-lg p-4 shadow-lg relative">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <div className="flex items-center gap-x-2">
                <ListCheck size={28} className="text-green-500" />
                <span className="text-xl font-bold text-green-500">Provide Certificate</span>
              </div>
              <XSquareIcon
                className="text-red-500 cursor-pointer"
                size={28}
                onClick={() => setConfirmationPopup(false)}
              />
            </div>
            <p className="font-semibold">
              Click <span className="text-green-500">Confirm</span> to approve course completion for
              "<b>{completionData.name}</b>" who has completed the course titled "<b>{completionData.title}</b>".
            </p>
            <button
              className="mt-4 w-full font-bold bg-green-500 text-white p-2 rounded-lg cursor-pointer"
              onClick={CompletionCourse}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

    </div>


      <Loader loading={makeLoading}/>     
    </>
  )
}

export default ManageEnrollments