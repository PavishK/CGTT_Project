import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {getUserData} from '../service/StorageService.jsx';
import {toast} from 'react-hot-toast';
import {
  Edit,
  Trash,
  XSquareIcon
} from 'lucide-react';
import Loader from '../Loader.jsx';

function ManageUsers() {
  const [usersData,setUsersData]=useState([]);
  const [deleteUser,setDeleteUser]=useState({});
  const [showPopup,setShowPopup]=useState(false);
  const [editUser,setEditUser]=useState({});
  const [selectedRole,setSelectedRole]=useState('user');
  const [showEditPopup,setShowEditPopup]=useState(false);
  const [makeLoading,setMakeLoading]=useState(false);
  const apiUrl=import.meta.env.VITE_SERVER_API;

  useEffect(()=>{
    const fetchUsersData=async()=>{
      setMakeLoading(true);
      try {
        const {_id,email}=getUserData();
        const res=await axios.get(`${apiUrl}/api/admin/get-users-info/${_id}/${email}`);
        setUsersData(res.data.data.filter((val)=>val._id!=_id))
        setMakeLoading(false);
      } catch (error) {
        toast.error(error.response.message || 'Unable to load users data.');
        setMakeLoading(false);
      }
    }

    fetchUsersData();
  },[apiUrl]);

  //MANAGE USERS
  const popupConfirm=(id,name)=>{
    setShowPopup(true);
    setDeleteUser({id:id,name:name});
  }

  const popupUpdate=(index,data)=>{
    setShowEditPopup(true);
    setEditUser({i:index,data:data});
  }

  const updateUser=async()=>{
    if(editUser.data.role!=selectedRole){
      setMakeLoading(true);
      try {
        const res=await axios.put(`${apiUrl}/api/admin/update-user-data/${editUser.data._id}`,{role:selectedRole,email:editUser.data.email});
        const updateUser=[...usersData];
        updateUser[editUser.i].role=selectedRole;
        setUsersData(updateUser);
        setShowEditPopup(false);
        toast.success("User updated successfully!");
      } catch (error) {
        toast.error("Something went wrong!");
      } finally{
        setMakeLoading(false);
      }
    }else
    toast("No update in data.");
    setShowEditPopup(false);
  }

  const DeleteUser=async()=>{
    setMakeLoading(true)
    try {
      const res=await axios.delete(`${apiUrl}/api/admin/delete-user-data/${deleteUser.id}`);
      setUsersData(usersData.filter(val=>val._id!=deleteUser.id));
      setShowPopup(false);
      toast.success('User removed successfully.');
    } catch (error) {
      toast.error('Unable to remove the user.');
      console.log(error);
    } finally{
      setMakeLoading(false);
    }
  }

  return (
    <>

      <div className='flex items-start justify-normal overflow-x-scroll w-full p-2 rounded-lg'>
      <div className={`text-xl font-semibold ${usersData.length>0?'hidden':'block'}`}>
        <h1>No users other then you☺️.</h1>
      </div>
      <table className={`w-full ${usersData.length==0?'hidden':''}`}>
      <tbody>
          <tr className='flex items-start text-lg justify-between border-b p-2 font-bold'>
            <td>ID</td>
            <td>USERNAME</td>
            <td>EMAIL</td>
            <td>ROLE</td>
            <td>MANAGE</td>
          </tr>
      </tbody>
        
        <tbody className='flex items-start justify-normal flex-col gap-y-2 w-full'>
        {usersData.map((val,i)=>(
          <tr className='w-full flex items-start justify-between text-start text-lg p-1.5 gap-x-2 border-b' key={i}>
            <td>{val._id}</td>
            <td>{val.name}</td>
            <td>
            <a href={`mailto:${val.email}`}>{val.email}</a>
            </td>
            <td className={`text-start capitalize ${val.role==='admin'?'text-red-500':'text-blue-500'}`}
            >{val.role}</td>
            <td>
              <div className='flex items-start justify-normal gap-x-2'>
                <button className='cursor-pointer bg-blue-500 text-white p-1 rounded-lg' title={"Edit "+val.name} onClick={()=>popupUpdate(i,val)}><Edit/></button>
                <button className='cursor-pointer bg-red-500 text-white rounded-lg p-1' onClick={()=>popupConfirm(val._id,val.name)}><Trash/></button>
              </div>
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      {/* Delete User */}

      {showPopup && (
        <div className="fixed top-0 left-0 z-[9999] w-screen h-screen flex items-center justify-center bg-black/70">
          <div className="w-[90%] max-w-sm bg-white border rounded-lg p-4 shadow-lg relative">
            <XSquareIcon
              className="absolute top-2 right-2 text-red-500 cursor-pointer"
              size={28}
              onClick={() => setShowPopup(false)}
            />
            <p className="font-semibold mb-4">
              Click <span className="text-green-500">Confirm</span> to remove "{deleteUser.name}".
            </p>
            <button
              className="w-full font-bold bg-green-500 text-white p-2 rounded-lg cursor-pointer"
              onClick={DeleteUser}
            >
              Confirm
            </button>
          </div>
        </div>
      )}


      {/* Edit User */}

     {showEditPopup && (
    <div className="fixed top-0 left-0 z-[9999] w-screen h-screen flex items-start justify-center bg-black/70">
      <div className="mt-28 w-[90%] max-w-md bg-white border rounded-lg shadow-lg">
        <div className="flex items-center justify-between border-b p-3">
          <h1 className="flex items-center gap-x-2 text-lg font-bold">
            <Edit className="text-blue-500" />
            Edit
          </h1>
          <XSquareIcon
            className="text-red-500 cursor-pointer"
            onClick={() => setShowEditPopup(false)}
          />
        </div>
        <div className="p-4 flex flex-col gap-y-3">
          <p className="font-semibold">
            Modify {editUser.data.name}'s role from the dropdown below.
          </p>
          <label className="font-bold w-full">
            Email:
            <input
              className="w-full border p-1 mt-1"
              value={editUser.data.email}
              disabled
            />
          </label>
          <label className="font-bold w-full">
            Role:
            <select
              name="role"
              className="w-full border p-1 mt-1"
              defaultValue={editUser.data.role}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </label>
          <button
            className="self-center bg-blue-500 text-white p-2 rounded-lg font-bold"
            onClick={updateUser}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  )}


      </div> 

      <Loader loading={makeLoading}/>
    </>
  )
}

export default ManageUsers