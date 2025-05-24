import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import Loder from '../Loader.jsx';
import {
  Trash2Icon,
  PlusIcon,
  XSquareIcon,
  PlusCircle
} from 'lucide-react';

function ManageTasks() {
  const location=useLocation();
  const [makeLoading,setMakeLoading]=useState(false);
  const [courseData,setCourseData]=useState(location.state);
  const [deleteTask,setDeleteTask]=useState({});
  const [showConfirmPopup,setShowConfirmPopup]=useState(false);
  const [tasks,setTasks]=useState([]);

  const [showAddNewTask,setShowAddNewTask]=useState(false);
  const [newTask,setNewTask]=useState({course_id:location.state.id,created_at:(new Date()),description:'',id:(tasks.length+1),title:''});

  const apiUrl=import.meta.env.VITE_SERVER_API;

  useEffect(()=>{
    const fetchCourseTasksData=async()=>{
      setCourseData(location.state);
      setMakeLoading(true);
      try {
        const res=await axios.get(`${apiUrl}/api/admin/get-course-tasks/${courseData.id}`);
        setTasks(res.data.data.reverse());
        console.log(tasks);
      } catch (error) {
        console.log(error);
        toast.error("Error in fetching course tasks.");
      } finally{
        setMakeLoading(false);
      }
    }
   fetchCourseTasksData();
  },[apiUrl]);

  const onClickShowConfirmPopup=(data)=>{
    setShowConfirmPopup(true);
    setDeleteTask(data);
  }

  const onInputChangeNewTask=(e)=>{
    setNewTask({...newTask,[e.target.name]:e.target.value});
  }

  const addTaskData=async()=>{
    setMakeLoading(true);
    if(newTask.title=='' || newTask.description==''){
      toast.error("Fill out the fields.");
      setMakeLoading(false);
    }
    else{
    try {
      await axios.post(apiUrl+"/api/admin/insert-course-task-data",newTask);
      setTasks([...tasks,newTask]);
      toast.success("Task added successfully.");
    } catch (error) {
      toast.error("Unable to add task.");
    } finally{
      setMakeLoading(false);
      setShowAddNewTask(false);
    }
  }
  }

  const deleteTaskData=async()=>{
    setMakeLoading(true);
    try {
      await axios.delete(`${apiUrl}/api/admin/delete-course-task-data/${deleteTask.id}`);
      setTasks(tasks.filter(val=>val.id!=deleteTask.id));
      toast.success("Task data deleted successfully!");
    } catch (error) {
      toast.error("Unable to delete task.")
    } finally{
      setMakeLoading(false);
      setShowConfirmPopup(false);
    }
  }

  return (
    <>
      <div className='fixed bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer  w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white transition-all hover:scale-105'onClick={()=>setShowAddNewTask(true)}>
        <PlusIcon size={35}/>
      </div>
    <div className={`${tasks.length!==0?'hidden':'block'} text-xl`}>
      <h1>No Task ADD + now ☺️.</h1>
    </div>
    <div className={`flex items-start justify-normal flex-col gap-y-2 w-full h-full ${tasks.length>0?'block':'hidden'}`}>
    {tasks.map((val,i)=>(
      <div className='w-full border flex items-start justify-between flex-row rounded-lg h-40' key={i}>
      <div className='flex items-start justify-normal flex-col gap-y-2 p-1.5 border-r w-full'>
      <div className='leading-4'>
      <h1 className='text-xl font-bold capitalize'>{val.title}</h1>
      <p>{new Date(val.created_at).toDateString()}</p>
      </div>
      <h1 className='text-lg font-normal'>Task ID : {val.id}</h1>
      <hr className='w-full'/>
      <p className='h-12 cursor-all-scroll overflow-scroll text-justify'>{val.description}</p>
      </div>
      <button className='cursor-pointer h-full w-20 flex items-center justify-center bg-red-500 text-white' onClick={()=>onClickShowConfirmPopup(val)}>
        <Trash2Icon size={30}/>
      </button>
      </div>
    ))}

    {showConfirmPopup?(
    <div className='fixed flex items-center justify-center w-full h-full transition-opacity duration-300 bg-black/70 rounded-lg'>
    <div className='mr-20 sm:mr-0 flex items-start justify-normal flex-col text-lg gap-y-2 w-fit bg-white p-3 border rounded-lg'>
    <XSquareIcon className='self-end text-red-500 cursor-pointer' size={28} onClick={()=>setShowConfirmPopup(false)}/>
      <p className='font-semibold'>Click <span className='text-green-500'>Confirm</span> to remove "{deleteTask.title}".</p>
      <button className='font-bold bg-green-500 text-white p-2 rounded-lg self-center cursor-pointer' onClick={deleteTaskData}>Confirm</button>
    </div>
    </div> 
    ):null}
    
      {showAddNewTask?(
      <div className='fixed flex items-start justify-center w-full h-full transition-opacity duration-300 bg-black/70 rounded-lg'>
      <div className='mr-20 sm:mr-0 flex items-start justify-normal flex-col text-lg gap-y-2 w-fit bg-white p-3 border rounded-lg mt-28'>
      <div className='flex items-start justify-between w-full border-b p-2'>
        <h1 className='flex items-center juno gap-x-1 text-lg font-bold'><PlusCircle className='text-blue-500'/>Add</h1>
        <XSquareIcon className='text-red-500 cursor-pointer' onClick={()=>setShowAddNewTask(false)}/>
      </div>
      <div className='flex items-start justify-normal gap-y-2 flex-col p-2'>
        <p className='font-semibold'>Adding new task for "{courseData.title}".</p>
        <div className='flex itst justify-normal flex-col gap-y-2'>
        <div className='flex items-start justify-between gap-x-2'>
          <label htmlFor='title' className='font-semibold'>
            Title 
          </label>
          <input type='text' name='title' required placeholder=' Course name' value={newTask.title} onChange={onInputChangeNewTask}/>
        </div>

        <div className='flex items-start justify-between gap-x-2'>
          <label htmlFor='description' className='font-semibold'>
            Description  
          </label>
          <textarea className='w-full focus:outline-0' required name='description' placeholder=' Course description' value={newTask.description} onChange={onInputChangeNewTask}></textarea>
        </div>

        </div>
        <button className='self-center cursor-pointer bg-green-500 p-2 rounded-lg text-lg font-bold text-white' onClick={addTaskData}>ADD</button>
      </div>
      </div>
      </div> 
      ):null}


    </div>
      <Loder loading={makeLoading}/>
    </>
  )
}

export default ManageTasks