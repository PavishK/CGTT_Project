import React, { useEffect, useState } from 'react';
import {
  Search,
  SearchX,
  Lock,
  Unlock,
} from 'lucide-react';
import Sample from '../assets/images/login_main.svg';
import Loader from '../Loader.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getUserData } from '../service/StorageService.jsx';

function Courses() {

  const [searchText,setSearchText]=useState('');
  const [coursesData,setCoursesData]=useState([]);
  const [filteredCourseData,setFilteredCourseData]=useState([]);
  const [enrolledCourseData,setEnrolledCourseData]=useState([]);
  const [makeLoading,setMakeLoading]=useState(false);
  const [userData,setUserData]=useState({});
  const apiUrl=import.meta.env.VITE_SERVER_API;

  useEffect(() => {
    const filtered = searchText.trim().length === 0
      ? coursesData
      : coursesData.filter((course) =>
          course.title.toLowerCase().includes(searchText.toLowerCase())
        );
    
    if(enrolledCourseData.length>0){
      const removeEnrollmentCourse=filtered.filter((value)=> 
        !enrolledCourseData.some((i)=> i.id===value.id));
      setFilteredCourseData(removeEnrollmentCourse);
    }
    else
      setFilteredCourseData(filtered);
  }, [searchText, coursesData]);

  useEffect(() => {

    const fetchEnrollmentCoursesData=async()=>{
      if(!getUserData())
        setUserData(false);
      else{
        const {_id}=getUserData();
      try {
        const res=await axios(apiUrl+`/api/course/list-enrolled-courses/${_id}`);
        setEnrolledCourseData(res.data.data)

      } catch (error) {
        console.log(error);
      }
    }
    }

    const fetchCourseData = async () => {
      
      try {
        setMakeLoading(true);
        const res = await axios.get(apiUrl + "/api/course/list-courses");
        setCoursesData(res.data.data);
        setFilteredCourseData(res.data.data);
        setMakeLoading(false);
      } catch (error) {
        toast.error("Unable to load courses");
        setMakeLoading(false);
      }
    };
  
    fetchCourseData();
    fetchEnrollmentCoursesData();
  }, []);

  return (
    <div className='flex items-start justify-start flex-col px-0.5 mt-3'>
    <div className='flex items-center justify-start p-2 w-fit  sm:w-9/12 gap-x-0.5 flex-row border rounded-lg self-center'>
    <Search size={23} color='#9B9497'/>
    <input type='text' value={searchText} onChange={(e)=>setSearchText(e.target.value)} className='w-full p-1  rounded-lg text-lg focus:outline-none' placeholder='Search'/>
    </div>

      {/* All Courses */}

    {filteredCourseData.length>0?(
      <div className='w-full'>
      <hr className='w-full mt-4'/>
    <h1 className='text-lg mt-3 font-bold'>Courses List ({coursesData.length})</h1>

    <div className='mt-5 w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))]  gap-y-4 gap-x-6'>
      {filteredCourseData.map((item,index)=>(
        <div className='border w-auto sm:w-auto h-72 rounded-lg transition-transform ease-out hover:scale-105' key={index}>
      <img src={Sample} className='w-full h-40 bg-gray-100'/>
      <div className='p-1.5 flex items-center justify-between'>
        <h1 className='text-xl capitalize font-bold'>{item.title}</h1>
        <div className={`p-1 rounded-full text-white bg-red-400`}>
        <Lock size={22}/>
        </div>
      </div>
      <p className='p-1.5'>{item.description}</p>
      </div>
      ))}

    </div>

      </div>
    ):(
      <div className='flex items-center justify-center text-xl font-normal w-full mt-10 gap-x-1'>
        <SearchX size={28} className='text-red-500'/>
        <h1>No courses match your search.</h1>
      </div>
    )}

     {/* Enrolled Courses */}

     {enrolledCourseData.length>0 && userData?(

      <div className='w-full'>

      <hr className='w-full mt-6'/>

      <h1 className='text-lg mt-3 font-bold'>Enrolled Courses ({enrolledCourseData.length})</h1>
      <div className='mt-5 w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))]  gap-3 gap-y-4 gap-x-6'>
      {enrolledCourseData.map((item,index)=>(
        <div className='border w-auto sm:w-auto h-72 rounded-lg transition-transform ease-out hover:scale-105' key={index}>
      <img src={Sample} className='w-full h-40 bg-gray-100'/>
      <div className='p-1.5 flex items-center justify-between'>
        <h1 className='text-xl capitalize font-bold'>{item.title}</h1>
        <div className={`p-1 rounded-full text-white bg-green-400`}>
        <Unlock size={22}/>
        </div>
      </div>
      <p className='p-1.5'>{item.description}</p>
      </div>
      ))}

      </div>

      </div>
      
     ):null}

     <Loader loading={makeLoading}/>
  </div>  
  )
}

export default Courses