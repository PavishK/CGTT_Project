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
      } catch (error) {
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

    {showConfirmPopup && (
      <div className="fixed top-0 left-0 z-[9999] w-screen h-screen flex items-center justify-center bg-black/70">
        <div className="w-[90%] max-w-sm bg-white border rounded-lg p-4 shadow-lg relative">
          <XSquareIcon
            className="absolute top-2 right-2 text-red-500 cursor-pointer"
            size={28}
            onClick={() => setShowConfirmPopup(false)}
          />
          <p className="font-semibold mb-4">
            Click <span className="text-green-500">Confirm</span> to remove "{deleteTask.title}".
          </p>
          <button
            className="w-full font-bold bg-green-500 text-white p-2 rounded-lg cursor-pointer"
            onClick={deleteTaskData}
          >
            Confirm
          </button>
        </div>
      </div>
    )}

    
      {showAddNewTask && (
        <div className="fixed top-0 left-0 z-[9999] w-screen h-screen flex items-start justify-center bg-black/70">
          <div className="mt-28 w-[90%] max-w-md bg-white border rounded-lg p-4 shadow-lg relative">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h1 className="flex items-center gap-x-2 text-lg font-bold">
                <PlusCircle className="text-blue-500" />
                Add
              </h1>
              <XSquareIcon
                className="text-red-500 cursor-pointer"
                onClick={() => setShowAddNewTask(false)}
              />
            </div>

            <div className="flex flex-col gap-y-4">
              <p className="font-semibold">
                Adding new task for "{courseData.title}".
              </p>

              <div className="flex flex-col gap-y-3">
                <div className="flex flex-col">
                  <label htmlFor="title" className="font-semibold mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="Course name"
                    className="border rounded p-2 focus:outline-none"
                    value={newTask.title}
                    onChange={onInputChangeNewTask}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="description" className="font-semibold mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    required
                    placeholder="Course description"
                    className="border rounded p-2 focus:outline-none"
                    value={newTask.description}
                    onChange={onInputChangeNewTask}
                  />
                </div>
              </div>

              <button
                className="self-center bg-green-500 text-white p-2 rounded-lg text-lg font-bold"
                onClick={addTaskData}
              >
                ADD
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
      <Loder loading={makeLoading}/>
    </>
  )
}

export default ManageTasks