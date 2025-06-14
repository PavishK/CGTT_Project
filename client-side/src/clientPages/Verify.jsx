import React, { useState, useEffect, Suspense } from 'react'
import VerifyImage from '../assets/images/verify-certificate.svg';
import {
  SearchX,
  BadgeCheck,
  Download,
  Info,
  Search,
  Check,
  XIcon,
  XSquareIcon,
  EyeIcon

} from 'lucide-react';
import {toast} from 'react-hot-toast';
import Loader from '../Loader.jsx';
import axios from 'axios';
import { motion } from 'framer-motion';
const GenerateCertificate = React.lazy(() => import('../certificate/GenerateCertificate'));

function Verify() {
  const [certificateIDFlage,setCertificateIDFlage]=useState(true);
  const [ID,setID]=useState('');
  const [certificateData,setCertificateData]=useState({status:false});
  const [visibilityStatus,setVisibilityStatus]=useState(false);
  const [makeLoading,setMakeLoading]=useState(false);

  const [downloadVisibility,setDownloadVisibility]=useState(false);

  const apiUrl=import.meta.env.VITE_SERVER_API;

  const checkCertificate=async()=>{
    if(ID.trim()==='')
      toast.error("Please provide certificate ID.");
    else{
      setMakeLoading(true);
      try {
        const res=await axios.get(`${apiUrl}/api/certificate/verify-certificate/${ID.trim().toLowerCase()}`);
        if(res.data.data.length==0){
          toast.error("No data found!");
          setCertificateData({...certificateData,status:false});
           setVisibilityStatus(true);
        }
        else{
          toast.success("Certificate details fetched!");
          setCertificateData({...res.data.data[0],status:true});
          setVisibilityStatus(false);
        }
       
      } catch (error) {
        toast.error("Unable to fetch certificate data.");
      } finally{
        setMakeLoading(false);
      }
    }
  }

  const formatDate=(str)=>{
    const fdate=new Date(str);
    let date=String(fdate.getDate()).padStart(2,'0');
    let month=String(fdate.getMonth()).padStart(2,'0');
    let year=fdate.getFullYear();
    return date+'/'+month+'/'+year;
  }

  const onEmailIdVerifyClicked=()=>{
    toast("This feature is available soon.",{icon:<Info size={28} className='text-blue-500'/>})
  }
  return (
    <>
  <div className='flex items-start justify-normal flex-col w-full'>
  {certificateIDFlage ? (

    <div className='flex items-center justify-normal gap-x-2 sm:flex-row flex-col-reverse mt-10 p-2'>

      <div className='flex-1/2 mt-10 p-2'>
          <div className='flex items-start justify-normal flex-col gap-y-4'>
            <h3 className='font-bold flex items-center justify-normal gap-x-1'>
            <div className='w-3 h-3 bg-black rounded-full'></div>
            Unlock the power of proof</h3>
            <h1 className='text-5xl sm:text-6xl font-medium text-justify'><b>Ensure</b> authenticity <br></br>in just a few clicks</h1>
            <p className='mt-2'>Use our secure verification tool to confirm that a certificate issued by our institition is valid. Simple enter the <b>Certificate ID</b> or the <b>registered Email ID</b> to fetch 
            the certificate details instantly. This service is available to employers, institutions, and individuals who want to verify credentials with confidence.</p>
          </div>
          <div className='flex items-center justify-normal gap-x-4 mt-8'>
            <button className='bg-black p-3 rounded-lg text-white transition-transform ease-in-out hover:scale-105 hover:cursor-pointer' onClick={()=>setCertificateIDFlage(false)}>Verify Using Certificate ID</button>
            <button className='border-2 text-black border-black p-2.5  rounded-lg transition-transform ease-in-out hover:scale-105 hover:cursor-pointer' onClick={onEmailIdVerifyClicked}>Verify using Email ID</button>
          </div>
        </div>

        <motion.div
        initial={{ y: -100, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}     
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex-1/2">
          <img src={VerifyImage} className='sm:w-full sm:h-full w-9/12 h-9/12 object-cover '/>
        </motion.div>
       
    </div>
  ):(
    <div className='flex items-start justify-normal w-full p-2'>
      <div className='items-center justify-center flex w-full flex-col'>
      <div className='flex items-center justify-center flex-col gap-y-2'>
        <h1 className='text-4xl font-bold'>Certificate Verification</h1>
        <p className='text-center text-lg'>Please input the valid certificate identification number.</p>
      </div>
      <div className='w-full flex items-start justify-normal flex-col gap-y-1 bg-white mt-2'>
        <h2 className='font-bold text-lg'>Enter certificate ID</h2>
        <input className='w-full focus:outline-0 caret-green-500 p-2.5 uppercase rounded-lg border text-xl' placeholder='TT-001-XXXX-XXXX' value={ID} name='ID' onChange={(e)=>setID(e.target.value)}/>
        <button className='w-full cursor-pointer mt-2 bg-black p-2.5 rounded-lg text-white text-xl font-bold' onClick={checkCertificate}>Check Certificate</button>
      </div>
      <hr className='w-full mt-6'/>

    {certificateData.status?(
      <div className='w-fit border rounded-lg mt-5'>
        <div className='flex items-start justify-normal w-full sm:gap-x-2 sm:flex-row flex-col gap-y-1.5 p-2'>
          <img src={certificateData.image_url} alt={certificateData.title} className='sm:w-96 sm:h-96 object-cover border-r'/>
        <div className='p-2 flex items-start justify-normal flex-col gap-y-2 w-full'>
        <h1 className='self-center text-2xl font-bold'>Certificate Details</h1>

          <div className='flex items-start justify-normal text-xl gap-x-6 w-full'>
            <h2 className='font-bold'>Name : </h2>
            <span className='uppercase'>{certificateData.name}</span>
          </div>

          <div className='flex items-start justify-normal text-xl gap-x-6 w-full'>
            <h2 className='font-bold'>Email : </h2>
            <span className=''>{certificateData.email}</span>
          </div>

          <div className='flex items-start justify-normal text-xl gap-x-6 w-full'>
            <h2 className='font-bold'>Course Name : </h2>
            <span className='capitalize'>{certificateData.title}</span>
          </div>

          <div className='flex items-start justify-normal text-xl gap-x-6 w-full'>
            <h2 className='font-bold'>Duration : </h2>
            <span className='uppercase'>{formatDate(certificateData.enrolled_at)} - {formatDate(certificateData.completed_at)}</span>
          </div>

          <div className='flex items-start justify-normal text-xl gap-x-6 w-full'>
            <h2 className='font-bold'>Certification ID : </h2>
            <span className='uppercase'>{certificateData.cid}</span>
          </div>

          <div className='flex items-start justify-normal text-xl gap-x-6 w-full'>
            <h2 className='font-bold'>Institute Name : </h2>
            <span className='capitalize bg-gradient-to-r from-blue-500 bg-clip-text text-transparent to-red-500 font-bold flex items-center justify-normal gap-x-1'>Training Trains <BadgeCheck className='text-green-500'/></span>
          </div>

          <div className='flex items-start justify-normal text-xl gap-x-6 w-full'>
            <h2 className='font-bold'>Valid : </h2>
            {certificateData.is_valid?(
              <span className='text-green-500 uppercase flex items-start justify-normal gap-x-1.5 font-semibold'>Valid<Check size={25}/></span>
            ):(
              <span className='text-red-500 uppercase flex items-start justify-normal gap-x-1.5 font-semibold'>InValid<XIcon size={25}/></span>
            )}
          </div>

          <hr className='w-full mt-4'/>
        <button className='self-center flex items-center justify-normal text-xl gap-x-1 bg-gray-200 p-3 cursor-pointer rounded-lg text-gray-800' onClick={()=>setDownloadVisibility(true)}><Download size={28}/>Download</button>
        </div>
        </div>
      </div>
    ):(

      <div>
      <div className={`text-xl text-red-500 flex items-center justify-center flex-col gap-y-0.5 font-bold mt-40 ${!visibilityStatus || certificateData.status?'hidden':'block'}`}>
       <SearchX size={36}/> No data available for the given ID.
      </div>

      <div className={`text-xl text-gray-600 flex items-center justify-center flex-col gap-y-0.5 font-bold mt-40 ${visibilityStatus?'hidden':'block'}`}>
       <Search size={36}/> Enter the certificate ID &<br/> Click 'Check Certificate'.
      </div>
      </div>


    )}

      </div>
    </div>
  )}

    {downloadVisibility?(
        <div className='fixed items-center justify-center w-full h-full transition-opacity duration-300 bg-black/70 rounded-lg overflow-auto p-2'>
        <center>
      <div className=' mr-20 sm:mr-0 flex items-start justify-normal flex-col text-lg gap-y-2 w-fit bg-white p-3 border rounded-lg mt-20 '>
      <div className='flex items-start justify-between w-full pr-20 sm:pr-0'>
        <div className='flex items-start justify-normal gap-x-1 text-xl font-bold text-blue-500'>
          <EyeIcon size={25}/>
          <h1>View / Download Certificate</h1>
        </div>
      <XSquareIcon className='self-end text-red-500 cursor-pointer' size={28} onClick={()=>setDownloadVisibility(false)}/>
      </div>
      <div className='mr-20 sm:mr-0'>
      <Suspense fallback={<div className='text-xl animate-pulse flex items-center justify-center w-full h-full'>Loading certificate...</div>}>
        <GenerateCertificate props={certificateData} close={()=>setDownloadVisibility(false)}/>
      </Suspense>
      </div>
      </div>
        </center>
        </div> 
    ):null}

  </div>
  <Loader loading={makeLoading}/>
  </>

  )
}

export default Verify