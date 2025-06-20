import React, { useEffect, useState } from 'react';
import {
  Search,
  SearchX,
  Lock,
  Unlock,
  GraduationCap,
  Lightbulb,
  FileText,
  TrendingUp,
  XSquareIcon,
  DoorOpen,
  Clock,
  BookOpen
} from 'lucide-react';
import Sample from '../assets/images/login_main.svg';
import Loader from '../Loader.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getUserData } from '../service/StorageService.jsx';
import {useNavigate} from 'react-router-dom';

function Courses() {

  const [searchText,setSearchText]=useState('');
  const [coursesData,setCoursesData]=useState([]);
  const [listCourses,setListCourses]=useState([]);
  const [filteredCourseData,setFilteredCourseData]=useState([]);
  const [enrolledCourseData,setEnrolledCourseData]=useState([]);
  const [makeLoading,setMakeLoading]=useState(false);
  const [userData,setUserData]=useState(getUserData());

  const [formPopup,setFormPopup]=useState(false);
  const [enrollPopup,setEnrollPopup]=useState(false);
  const [enrollmentData,setEnrollmentData]=useState({});

  const navigate=useNavigate(null);
  const apiUrl=import.meta.env.VITE_SERVER_API;


  const EnrollmentRequest=async()=>{
    setMakeLoading(true);
    try {
      await axios.post(apiUrl+'/api/course/enollment-request',{user_id:userData._id,course_id:enrollmentData.id});
      toast.success('Enrollment request submitted! Await admin approval.')
    } catch (error) {
      toast.error("Unable to submit enrollment request.");
    } finally{
      setMakeLoading(false);
      setEnrollPopup(false);
    }
  }

  const onClickSelectedCourse=(data)=>{
   if(!userData){
    toast("Please log in or register to continue to the course.",{icon:<DoorOpen className='text-green-500' size={28}/>});
    setFormPopup(true);
   }
   else{
    toast("Please enroll to continue with the course.",{icon:<BookOpen className='text-blue-500' size={28}/>});
    setEnrollPopup(true);
    setEnrollmentData(data);
   }
  }

  const onEnrolledCourseClicked=(data)=>{
    if(data.enrollment_status){
      navigate(`/selected-course/${data.title}`,{state:data})
    }
    else{
      toast("Your enrollment request for this course is in progress.",
        {
          icon:<Clock className='text-yellow-500' size={28}/>,
        }
      )
    }
  }

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
        console.log("No enrolled courses.");
      }
    }
    }

    const fetchCourseData = async () => {
      
      try {
        setMakeLoading(true);
        const res = await axios.get(apiUrl + "/api/course/list-courses");
        setCoursesData(res.data.data);
        setFilteredCourseData(res.data.data);
        setListCourses(res.data.data.map((ele)=>ele.title))
        setMakeLoading(false);
      } catch (error) {
        toast.error("Unable to load courses");
        setMakeLoading(false);
      }
    };
  
    fetchCourseData();
    fetchEnrollmentCoursesData();
    setUserData(getUserData());
  }, []);

  return (
    <div className='flex items-start justify-start flex-col px-0.5 mt-3'>
    <div className='flex items-center justify-start p-2 w-fit  sm:w-9/12 gap-x-0.5 flex-row border rounded-lg self-center'>
    <Search size={23} color='#9B9497'/>
    <input type='text' list='courses' name='courseLists' value={searchText} onChange={(e)=>setSearchText(e.target.value)} className='w-full p-1  rounded-lg text-lg focus:outline-none' placeholder='Search'/>

    <datalist id='courses'>
    {listCourses.map((val,i)=>(
      <option value={val} key={i}/>
    ))}
    </datalist>

    </div>

      {/* All Courses */}

    {filteredCourseData.length>0?(
      <div className='w-full'>
      <hr className='w-full mt-4'/>
    <h1 className='text-lg mt-3 font-bold'>Courses List ({coursesData.length})</h1>

    <div className='mt-5 w-full grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]  gap-y-4 gap-x-6'>
      {filteredCourseData.map((item,index)=>(
        <div className='border w-auto sm:w-auto h-80 rounded-lg transition-transform ease-out cursor-pointer' key={index} onClick={()=>onClickSelectedCourse(item)}>
      <img src={item.image_url} className='w-full h-40 bg-gray-100'/>
      <div className='p-1.5 flex items-center justify-between'>
        <h1 className='text-xl capitalize font-bold'>{item.title}</h1>
        <div className={`p-1 rounded-full text-white bg-red-400`}>
        <Lock size={22}/>
        </div>
      </div>
      <p className='p-1.5 w-auto h-20 overflow-scroll cursor-all-scroll'>{item.description}</p>
      <div className='p-1.5 sm:flex items-center justify-normal gap-x-1.5 self-end w-auto hidden'>
        <GraduationCap/>
        <Lightbulb/>
        <FileText/>
        <TrendingUp/>
      </div>
      </div>
      ))}

    </div>

      </div>
    ):(
      <div className={`flex items-center justify-center text-xl font-normal w-full mt-10 gap-x-1 ${enrolledCourseData.length>0 || coursesData.length==0 ?'hidden':'block'}`}>
        <SearchX size={28} className='text-red-500'/>
        <h1>No courses match your search.</h1>
      </div>
    )}

      <div className={`flex items-center justify-center text-xl font-normal w-full mt-10 gap-x-1 ${coursesData.length!==0 ?'hidden':'block'}`}>
        <SearchX size={28} className='text-red-500'/>
        <h1>No Courses Added!</h1>
      </div>

     {/* Enrolled Courses */}

     {enrolledCourseData.length>0 && userData?(

      <div className='w-full'>

      <hr className='w-full mt-6'/>

      <h1 className='text-lg mt-3 font-bold'>Enrolled Courses ({enrolledCourseData.length})</h1>
      <div className='mt-5 w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))]  gap-3 gap-y-4 gap-x-6'>
      {enrolledCourseData.map((item,index)=>(

      <div className={`border w-auto sm:w-auto h-72 rounded-lg transition-transform ease-out ${item.enrollment_status?'cursor-pointer':'cursor-wait bg-gray-100'}`} key={index} onClick={()=>onEnrolledCourseClicked(item)}>
      <img src={Sample} className='w-full h-40 bg-gray-100'/>
      <div className='p-1.5 flex items-center justify-between'>
        <h1 className='text-xl capitalize font-bold'>{item.title}</h1>
        <div className={`p-1 rounded-full text-white ${item.enrollment_status?'bg-green-400':'bg-yellow-400'}`}>
        <Unlock size={22} className={`${!item.enrollment_status?'hidden':'block'}`}/>
        <Lock size={22} className={`${item.enrollment_status?'hidden':'block'}`}/>
        </div>
      </div>
            <p className='p-1.5 w-auto  h-20 overflow-scroll cursor-all-scroll'>{item.description}</p>
      </div>
      ))}

      </div>

      </div>
      
     ):null}

     {/* Login Popup */}

{formPopup && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
    <div className="relative w-[95%] max-w-lg bg-white p-6 rounded-xl shadow-2xl border">
      <button
        onClick={() => setFormPopup(false)}
        className="absolute top-3 right-3 text-red-500 hover:text-red-600 cursor-pointer"
        aria-label="Close popup"
      >
        <XSquareIcon size={24} />
      </button>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-green-600">
          <DoorOpen size={28} />
          <span className="text-2xl font-bold">Login / Register</span>
        </div>
        <p className="text-center text-gray-600">
          Every journey begins with a step.
        </p>
        <img src={Sample} alt="sample" className="w-full h-auto rounded-lg" />
        <button
          onClick={() => navigate('/user-login_register')}
          className="bg-green-500 text-white py-2 px-4 rounded-lg font-bold hover:underline self-center"
        >
          Login / Register
        </button>
      </div>
    </div>
  </div>
)}


      {/* Enroll Popup */}

      {enrollPopup && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
    <div className="relative w-[95%] max-w-lg bg-white p-6 rounded-xl shadow-2xl border">
      <button
        onClick={() => setEnrollPopup(false)}
        className="absolute top-3 right-3 text-red-500 hover:text-red-600 cursor-pointer"
        aria-label="Close popup"
      >
        <XSquareIcon size={24} />
      </button>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-blue-600">
          <BookOpen size={28} />
          <span className="text-2xl font-bold">Request Enrollment</span>
        </div>

        <div className="flex items-center gap-2 text-lg text-gray-700">
          <span>Certificate</span>
          <span>|</span>
          <span className="capitalize font-medium">{enrollmentData.title}</span>
        </div>

        <hr className="border-gray-300" />

        <p className="text-gray-700 font-semibold text-sm leading-relaxed">
          [Note: Enrollment approval may take a few days. <br />
          Check back daily for updates.]
        </p>

        <button
          onClick={EnrollmentRequest}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg font-bold hover:underline self-center"
        >
          Enroll
        </button>
      </div>
    </div>
  </div>
)}

     <Loader loading={makeLoading}/>
  </div>  
  )
}

export default Courses