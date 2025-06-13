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
        toast.error("Session expired. Please login.");
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
      <div className={`flex items-start justify-normal flex-col gap-y-3`}>
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

      {/* Delete Course */}
      {showConfirmPopup && (
        <div className="fixed top-0 left-0 z-[9999] w-screen h-screen flex items-center justify-center bg-black/70">
          <div className="w-[90%] max-w-md bg-white border rounded-lg p-4 shadow-lg relative">
            <XSquareIcon
              className="absolute top-2 right-2 text-red-500 cursor-pointer"
              size={28}
              onClick={() => setShowConfirmPopup(false)}
            />
            <p className="font-semibold mt-6">
              Click <span className="text-green-500">Confirm</span> to remove "<b>{deleteCourse.title}</b>".
            </p>
            <button
              className="mt-4 w-full font-bold bg-green-500 text-white p-2 rounded-lg cursor-pointer"
              onClick={deleteCourseData}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Edit Course */}
      {showEditPopup && (
        <div className="fixed top-0 left-0 z-[9999] w-screen h-screen flex items-center justify-center bg-black/70">
          <div className="w-[90%] max-w-lg bg-white border rounded-lg p-4 shadow-lg relative mt-16">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h1 className="flex items-center gap-x-2 text-lg font-bold">
                <Edit className="text-blue-500" /> Edit Course
              </h1>
              <XSquareIcon
                className="text-red-500 cursor-pointer"
                size={28}
                onClick={() => setShowEditPopup(false)}
              />
            </div>
            <p className="font-semibold mb-2">Modify Course ID: <b>{editCourse.id}</b></p>

            <div className="flex flex-col gap-y-3">
              <label className="font-semibold">
                Title
                <input
                  type="text"
                  name="title"
                  className="w-full border p-1 rounded"
                  value={editCourse.title}
                  onChange={onChangeEditCourseData}
                />
              </label>

              <label className="font-semibold">
                Image URL
                <input
                  type="text"
                  name="image_url"
                  className="w-full border p-1 rounded"
                  value={editCourse.image_url}
                  onChange={onChangeEditCourseData}
                />
              </label>

              <label className="font-semibold">
                Description
                <textarea
                  name="description"
                  className="w-full border p-1 rounded resize-none"
                  value={editCourse.description}
                  onChange={onChangeEditCourseData}
                ></textarea>
              </label>
            </div>

            <button
              className="mt-4 w-full bg-blue-500 text-white font-bold p-2 rounded-lg cursor-pointer"
              onClick={editCourseData}
            >
              Update
            </button>
          </div>
        </div>
      )}

      {/* Add New Course */}
      {showAddCourse && (
        <div className="fixed top-0 left-0 z-[9999] w-screen h-screen flex items-center justify-center bg-black/70">
          <div className="w-[90%] max-w-lg bg-white border rounded-lg p-4 shadow-lg relative mt-16">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h1 className="flex items-center gap-x-2 text-lg font-bold">
                <PlusCircle className="text-blue-500" /> Add Course
              </h1>
              <XSquareIcon
                className="text-red-500 cursor-pointer"
                size={28}
                onClick={() => setShowAddCourse(false)}
              />
            </div>

            <p className="font-semibold mb-2">Add a new course below:</p>

            <div className="flex flex-col gap-y-3">
              <label className="font-semibold">
                Title
                <input
                  type="text"
                  name="title"
                  className="w-full border p-1 rounded"
                  placeholder="Course name"
                  required
                  value={newCourse.title}
                  onChange={onChangeNewCourseData}
                />
              </label>

              <label className="font-semibold">
                Image URL
                <input
                  type="text"
                  name="image_url"
                  className="w-full border p-1 rounded"
                  placeholder="Image URL"
                  required
                  value={newCourse.image_url}
                  onChange={onChangeNewCourseData}
                />
              </label>

              <label className="font-semibold">
                Description
                <textarea
                  name="description"
                  className="w-full border p-1 rounded resize-none"
                  placeholder="Course description"
                  required
                  value={newCourse.description}
                  onChange={onChangeNewCourseData}
                ></textarea>
              </label>
            </div>

            <button
              className="mt-4 w-full bg-green-500 text-white font-bold p-2 rounded-lg cursor-pointer"
              onClick={addNewCourseData}
            >
              Add
            </button>
          </div>
        </div>
      )}



      </div>
      <Loader loading={makeLoading}/>
    </>
  )
}

export default ManageCourses