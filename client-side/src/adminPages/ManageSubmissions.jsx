import React, { useEffect, useState } from 'react';
import { Edit, Trash, XSquareIcon } from 'lucide-react';
import axios from 'axios';
import { getUserData } from '../service/StorageService.jsx';
import { toast } from 'react-hot-toast';
import Loader from '../Loader.jsx';

function ManageSubmissions() {
  const [userData, setUserData] = useState({});
  const [makeLoading, setMakeLoading] = useState(false);
  const [submissionDatas, setSubmissionDatas] = useState([]); 

  const [deletPopup,setDeletePopup]= useState(false);
  const [deleteData,setDeleteDat]=useState({});

  const [editPopup,setEditPopup]=useState(false);
  const [editData,setEditData]=useState({});
  const [changeStatus,setChangeStatus]=useState('pending');
  const [rejectedReason,setRejectedReason]=useState("");

  const apiUrl = import.meta.env.VITE_SERVER_API;
  const statusColor={pending:"text-yellow-500",rejected:"text-red-500",accepted:"text-green-500"}


  useEffect(() => {
    const data = getUserData();
    setUserData(data);
  }, []);

  useEffect(() => {
    if (userData?._id && userData?.email) {
      fetchSubmissionData();
    }
  }, [userData]);

  const fetchSubmissionData = async () => {
    setMakeLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/api/admin/get-submissions-data/${userData._id}/${userData.email}`
      );
      setSubmissionDatas(res.data.data);
    } catch (error) {
      toast.error('Session expired. Please login.');
    } finally {
      setMakeLoading(false);
    }
  };

  const onFileOpen=(url,name)=>{
    const features=`width=500,height=500,resizable=yes,scrollbars=yes`;
    const title=name+" file";
    const newWindow=window.open(url,title,features);

    if(newWindow)
      newWindow.document.title=title;
    else
      toast.error("Popup blocked. Please allow popup for this site.")
  }

  //Delete Submission

  const ShowDeletePopup=(data)=>{
    setDeleteDat(data);
    setDeletePopup(true);
  }

  const OnConfirmDelete=async()=>{
    setMakeLoading(true);
    try {
      await axios.delete(`${apiUrl}/api/admin/delete-submission-data/${deleteData.id}`);
      setSubmissionDatas(submissionDatas.filter((items)=>items.id!=deleteData.id));
      toast.success("Submission data deleted successfully.")
    } catch (error) {
      toast.error("Unable to delete submission.");
    } finally {
      setDeletePopup(false);
      setMakeLoading(false);
    }
  }
  //Edit submission
  const ShowEditPopup=(data,i)=>{
    setEditData({...data,index:i});
    setEditPopup(true);
  }

  const EditSubmission=async()=>{
    setMakeLoading(true);
    if(changeStatus==="rejected" && rejectedReason===""){
      toast.error("Please specify the reason for rejection.");
    }
    else{
      try {
        await axios.put(`${apiUrl}/api/admin/update-submission-data/${editData.id}`,{status:changeStatus,reason:rejectedReason});
        const updateData=[...submissionDatas];
        updateData[editData.index].status=changeStatus;
        setSubmissionDatas(updateData);
        toast.success("Submission status updated successfully.")
      } catch (error) {
        toast.error("Unable to update submission status.");
      } finally {
        setEditPopup(false);
        setMakeLoading(false);
      }
    }
  }
  return (
    <>
      <div className="flex items-start justify-between overflow-x-scroll w-full p-1 rounded-lg">
        <div
          className={`text-xl font-semibold ${
            submissionDatas.length > 0 ? 'hidden' : 'block'
          }`}
        >
          <h1>No submission yet☺️.</h1>
        </div>
        <table
          className={`w-full ${submissionDatas.length === 0 ? 'hidden' : ''}`}
        >
          <tbody>
            <tr className="flex items-start text-lg justify-between border-b p-1 font-bold gap-x-8">
              <td>NAME</td>
              <td>EMAIL</td>
              <td>DATE</td>
              <td>FILE_URL</td>
              <td>STATUS</td>
              <td>MANAGE</td>
            </tr>
          </tbody>

          <tbody className="flex items-start justify-between flex-col gap-y-2 w-full gap-x-2">
            {submissionDatas.map((val, i) => (
              <tr
                className="w-full flex items-start justify-between text-start text-lg p-1.5 gap-x-8 border-b"
                key={i}
              >
                <td>{val.name}</td>
                <td>
                  <a href={`mailto:${val.email}`}>{val.email}</a>
                </td>

                <td className='whitespace-nowrap'>{new Date(val.submited_at).toDateString()}</td>

                <td onClick={()=>onFileOpen(val.file_url,val.name)}
                  className={`text-start cursor-pointer lowercase text-blue-500 underline w-32 line-clamp-1 `}>
                  {val.file_url}
                </td>

                <td
                  className={`text-start capitalize ${statusColor[val.status]}`}>
                  {val.status}
                </td>
                <td>
                  <div className="flex items-start justify-normal gap-x-2">
                    <button
                      className="cursor-pointer bg-blue-500 text-white p-1 rounded-lg"
                      title={'Edit ' + val.name} onClick={()=>ShowEditPopup(val,i)}>
                      <Edit />
                    </button>
                    <button className="cursor-pointer bg-red-500 text-white rounded-lg p-1" onClick={()=>ShowDeletePopup(val)}>
                      <Trash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

     {deletPopup && (
      <div className="fixed top-0 left-0 z-[9999] w-screen h-screen flex items-center justify-center bg-black/70">
        <div className="w-[90%] max-w-sm bg-white border rounded-lg p-4 shadow-lg relative">
          <XSquareIcon
            className="absolute top-2 right-2 text-red-500 cursor-pointer"
            size={28}
            onClick={() => setDeletePopup(false)}
          />
          <p className="font-semibold mb-4">
            Click <span className="text-green-500">Confirm</span> to remove <b>{deleteData.name}'s</b> submission.
          </p>
          <button
            className="w-full font-bold bg-green-500 text-white p-2 rounded-lg cursor-pointer"
            onClick={OnConfirmDelete}
          >
            Confirm
          </button>
        </div>
      </div>
    )}

    {editPopup && (
      <div className="fixed top-0 left-0 z-[9999] w-screen h-screen flex items-start justify-center bg-black/70">
        <div className="mt-28 w-[90%] max-w-sm bg-white border rounded-lg p-4 shadow-lg relative">
          <div className="flex items-center justify-between border-b pb-2 mb-3">
            <h1 className="flex items-center gap-x-2 text-lg font-bold">
              <Edit className="text-blue-500" />
              Edit Status
            </h1>
            <XSquareIcon
              className="text-red-500 cursor-pointer"
              onClick={() => setEditPopup(false)} 
            />
          </div>

          <div className="flex flex-col gap-y-4">
            <p className="font-semibold">
              Modify {editData.name}'s submission status from the dropdown below.
            </p>

            <label className="font-bold w-full">
              Status:
              <select
                name="role"
                className="w-full capitalize mt-1 border p-2 rounded"
                defaultValue={changeStatus}
                onChange={(e) => setChangeStatus(e.target.value)}
              >
                <option value="pending">pending</option>
                <option value="accepted">accepted</option>
                <option value="rejected">rejected</option>
              </select>
            </label>

          {changeStatus==="rejected" &&(
            <label className="font-bold w-full">
              Reason for rejection:
              <textarea type='text'
              value={rejectedReason}
              name='reason' 
              placeholder='Specify the reason for rejection.'
              className="w-full mt-1 border p-2 rounded resize-none"
              onChange={(e)=>setRejectedReason(e.target.value)}
              />
            </label>
          )}

            <button
              className="self-center bg-blue-500 text-white p-2 rounded-lg text-lg font-bold"
              onClick={EditSubmission}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    )}


      </div>
      <Loader loading={makeLoading} />
    </>
  );
}

export default ManageSubmissions;
