import React, { useState, useEffect } from 'react'
import { getUserData } from '../service/StorageService';
import toast from 'react-hot-toast';
import axios from 'axios';
import Sample from '../assets/images/main_page_image.svg';
import {
  Edit2,
  Trash2Icon,
  PlusIcon,
  XSquareIcon,
  Edit,
  PlusCircle
} from 'lucide-react';
import Loader from '../Loader.jsx';
import { useNavigate } from 'react-router-dom';

function ManageCourses() {

  const navigate=useNavigate(null);
  const [coursesData,setCoursesData]=useState([]);
  const [makeLoading,setMakeLoading]=useState(false);
  const [showConfirmPopup,setShowConfirmPopup]=useState(false);
  const [showEditPopup,setShowEditPopup]=useState(false);
  const [deleteCourse,setDeleteCourse]=useState({});
  const [editCourse,setEditCourse]=useState({});

  const [showAddCourse,setShowAddCourse]=useState(false);
  const [newCourse,setNewCourse]=useState({title:'',description:'',image_url:'',id:(coursesData.length+1),taskCount:0,created_at:(new Date()),enrollmentCount:0});

  const apiUrl=import.meta.env.VITE_SERVER_API;

  useEffect(()=>{
    const fetchCoursesData=async()=>{
      setMakeLoading(true);
      try {
        const {_id,email}=getUserData();
        const res=await axios.get(`${apiUrl}/api/admin/get-courses-info/${_id}/${email}`);
        setCoursesData(res.data.data.merged)
      } catch (error) {
        toast.error(error.response.message || 'Unable to load courses data.');
      } finally{
        setMakeLoading(false);
      }
    }
    fetchCoursesData();
  },[apiUrl])

  const onSelectCourse=(data)=>{
    navigate('/admin/manage-tasks',{state:data})
  }

  const onClickConfirmPopup=(course)=>{
    setDeleteCourse(course);
    setShowConfirmPopup(true);
  }

  const onClickEditPopup=(course,i)=>{
    setEditCourse({...course,index:i});
    setShowEditPopup(true);
  }

  const onChangeEditCourseData=(e)=>{
    setEditCourse({...editCourse,[e.target.name]:e.target.value});
  }

  const onChangeNewCourseData=(e)=>{
    setNewCourse({...newCourse,[e.target.name]:e.target.value});
  }

  const addNewCourseData=async()=>{
    setMakeLoading(true);

    if(newCourse.title=='' || newCourse.image_url=='' || newCourse.description==''){
       toast.error("Please fill up the empty fields.")
       setMakeLoading(false);
    }

    else{
    try {
      await axios.post(apiUrl+'/api/admin/insert-course-data',newCourse);
      setCoursesData([...coursesData,newCourse]);
      toast.success("New course added successfully.");
    } catch (error) {
      toast.error("Unable to add new course.");
    } finally{
      setMakeLoading(false);
      setShowAddCourse(false);
    }
  }
  }

  const editCourseData=async()=>{
    setMakeLoading(true);
    try {
      await axios.put(`${apiUrl}/api/admin/update-course-data/${editCourse.id}`,editCourse);
      const updateCourse=[...coursesData];
      updateCourse[editCourse.index]=editCourse;
      setCoursesData(updateCourse);
      toast.success("Course data updated successfully.");
    } catch (error) {
      toast.error("Unable to edit course data.");
    } finally{
      setMakeLoading(false);
      setShowEditPopup(false);
    }
  }

  const deleteCourseData=async()=>{
    setMakeLoading(true);
    try {
      await axios.delete(`${apiUrl}/api/admin/delete-course-data/${deleteCourse.id}`);
      setCoursesData(coursesData.filter(val=>val.id!=deleteCourse.id));
      toast.success("Course data deleted successfully!");
    } catch (error) {
        toast.error("Unable to delete course data.");
    } finally{
      setMakeLoading(false);
      setShowConfirmPopup(false);
    }
  }
  return (
    <>
      <div className='fixed bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer  w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white transition-all hover:scale-105'  onClick={()=>setShowAddCourse(true)}>
        <PlusIcon size={35}/>
      </div>
      <div className={`${coursesData.length!==0?'hidden':'block'} text-xl`}>
        <h1>No Course ADD + now ☺️.</h1>
      </div>
      <div className={`flex items-start justify-normal flex-col gap-y-3 ${coursesData.length>0?'block':'hidden'}`}>
      {coursesData.map((val,i)=>(
        <div className='flex items-start justify-normal border rounded-lg flex-row gap-x-2 h-48 w-full overflow-x-auto overflow-y-hidden' key={i}>
          <img src={val?.image_url || Sample} alt={val.title} className='sm:w-56 h-48 w-36 border-r'/>
          <div className='flex items-start justify-normal flex-col gap-y-1.5 p-0.5 cursor-pointer' onClick={()=>onSelectCourse(val)}>
            <h1 className='text-xl font-bold capitalize'>{val.title}</h1>
            <p className='text-justify h-14 overflow-y-scroll sm:w-5xl cursor-all-scroll'>{val.description}</p>
            <hr className='w-full py-1'/>
            <div className='flex items-start justify-normal gap-x-5 w-lg'>
              <div className='border-r pr-3'>
                <p className='font-semibold'>Course ID : {val.id} </p>
                <p>{new Date(val.created_at).toDateString()}</p>
              </div>
              <div className=''>
                <p>Tasks : {val.taskCount}</p>
                <p>Enrolled : {val.enrollmentCount}</p>
              </div>
            </div>
          </div>
          <div className='border-l h-48 sm:w-36 flex items-center justify-around flex-col gap-y-1 p-1'>
          <button className='bg-blue-500 w-full h-full flex items-center justify-center text-white rounded-lg cursor-pointer' onClick={()=>onClickEditPopup(val,i)}><Edit2 size={30}/></button>
          <button className='bg-red-500 w-full h-full flex items-center justify-center text-white rounded-lg cursor-pointer' onClick={()=>onClickConfirmPopup(val)}> <Trash2Icon size={30}/></button>
          </div>
        </div>
      ))}

      {showConfirmPopup?(
      <div className='fixed flex items-center justify-center w-full h-full transition-opacity duration-300 bg-black/70 rounded-lg'>
      <div className='mr-20 sm:mr-0 flex items-start justify-normal flex-col text-lg gap-y-2 w-fit bg-white p-3 border rounded-lg'>
      <XSquareIcon className='self-end text-red-500 cursor-pointer' size={28} onClick={()=>setShowConfirmPopup(false)}/>
        <p className='font-semibold'>Click <span className='text-green-500'>Confirm</span> to remove "{deleteCourse.title}".</p>
        <button className='font-bold bg-green-500 text-white p-2 rounded-lg self-center cursor-pointer' onClick={deleteCourseData}>Confirm</button>
      </div>
      </div> 
      ):null}

      {/* Edit Course */}
       {showEditPopup?(
      <div className='fixed flex items-start justify-center w-full h-full transition-opacity duration-300 bg-black/70 rounded-lg'>
      <div className='mr-20 sm:mr-0 flex items-start justify-normal flex-col text-lg gap-y-2 w-fit bg-white p-3 border rounded-lg mt-28'>
      <div className='flex items-start justify-between w-full border-b p-2'>
        <h1 className='flex items-center juno gap-x-1 text-lg font-bold'><Edit className='text-blue-500'/>Edit</h1>
        <XSquareIcon className='text-red-500 cursor-pointer' onClick={()=>setShowEditPopup(false)}/>
      </div>
      <div className='flex items-start justify-normal gap-y-2 flex-col p-2'>
        <p className='font-semibold'>Modify Course ID <b>{editCourse.id}</b>.</p>
        <div className='flex itst justify-normal flex-col gap-y-2'>
        <div className='flex items-start justify-between gap-x-2'>
          <label htmlFor='title' className='font-semibold'>
            Title 
          </label>
          <input type='text' name='title'value={editCourse.title} onChange={onChangeEditCourseData}/>
        </div>

        <div className='flex items-start justify-between gap-x-2'>
          <label htmlFor='image_url' className='font-semibold'>
            Image URL  
          </label>
          <input type='text' name='image_url' value={editCourse.image_url} onChange={onChangeEditCourseData}/> 
        </div>

        <div className='flex items-start justify-between gap-x-2'>
          <label htmlFor='description' className='font-semibold'>
            Description  
          </label>
          <textarea className='w-full' name='description' value={editCourse.description} onChange={onChangeEditCourseData}></textarea>
        </div>

        </div>
        <button className='self-center cursor-pointer bg-blue-500 p-2 rounded-lg text-lg font-bold text-white' onClick={editCourseData}>Update</button>
      </div>
      </div>
      </div> 
      ):null}

      {/* New Course */}

       {showAddCourse?(
      <div className='fixed flex items-start justify-center w-full h-full transition-opacity duration-300 bg-black/70 rounded-lg'>
      <div className='mr-20 sm:mr-0 flex items-start justify-normal flex-col text-lg gap-y-2 w-fit bg-white p-3 border rounded-lg mt-28'>
      <div className='flex items-start justify-between w-full border-b p-2'>
        <h1 className='flex items-center juno gap-x-1 text-lg font-bold'><PlusCircle className='text-blue-500'/>Add</h1>
        <XSquareIcon className='text-red-500 cursor-pointer' onClick={()=>setShowAddCourse(false)}/>
      </div>
      <div className='flex items-start justify-normal gap-y-2 flex-col p-2'>
        <p className='font-semibold'>Adding new course.</p>
        <div className='flex itst justify-normal flex-col gap-y-2'>
        <div className='flex items-start justify-between gap-x-2'>
          <label htmlFor='title' className='font-semibold'>
            Title 
          </label>
          <input type='text' name='title' required placeholder=' Course name' value={newCourse.title} onChange={onChangeNewCourseData}/>
        </div>

        <div className='flex items-start justify-between gap-x-2'>
          <label htmlFor='image_url' className='font-semibold'>
            Image URL  
          </label>
          <input type='text' name='image_url' required placeholder=' Image URL' value={newCourse.image_url} onChange={onChangeNewCourseData}/> 
        </div>

        <div className='flex items-start justify-between gap-x-2'>
          <label htmlFor='description' className='font-semibold'>
            Description  
          </label>
          <textarea className='w-full focus:outline-0' required name='description' placeholder=' Course description' value={newCourse.description} onChange={onChangeNewCourseData}></textarea>
        </div>

        </div>
        <button className='self-center cursor-pointer bg-green-500 p-2 rounded-lg text-lg font-bold text-white' onClick={addNewCourseData}>ADD</button>
      </div>
      </div>
      </div> 
      ):null}



      </div>
      <Loader loading={makeLoading}/>
    </>
  )
}

export default ManageCourses