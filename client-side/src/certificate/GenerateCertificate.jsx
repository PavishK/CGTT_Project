import React, { useRef } from 'react';
import TTLogo from '../assets/images/ttlogo.png';
import './certificateStyle.css';
import {toast} from 'react-hot-toast';

function GenerateCertificate({props,close}) {
  const certificateRef = useRef();

  const formatDate=(date)=>{
    const str=new Date(date);
    let fdate=String(str.getDate()).padStart(2,'0');
    let fmonth=String(str.getMonth()).padStart(2,'0');
    let year=String(str.getFullYear())
    return String(fdate+'/'+fmonth+'/'+year);
  }

 const downloadPDF = async (e) => {
  e.preventDefault();
  toast.success("Download started!");

  // Lazy-load jsPDF
  const { jsPDF } = await import('jspdf');
  const html2canvas = (await import('html2canvas')).default;

  const canvas = await html2canvas(certificateRef.current, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [canvas.width, canvas.height],
  });

  const fileName = `TT-${props.name.replaceAll(' ', '')}-${props.title.replaceAll(' ', '_')}.pdf`;
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(fileName);

  toast.success('Download Completed!');
  close();
};


  return (
    <>
    <div className='flex items-center justify-center flex-col gap-y-1 w-full sm:pl-0 pl-20'>
      <div
        ref={certificateRef}
        className="flex items-center justify-center flex-col border-8 p-5 m-2 bg-gradient-to-b from-[#eff6ff] via-[#ffffff] to-[#dbeafe] w-[800px]"
      >
        <div className="flex items-center justify-center flex-col gap-y-2 w-full">
          <div className="w-full flex items-center justify-center -mt-5">
            <img src={TTLogo} className="w-64 rounded-lg" />
          </div>
          <h1 className="text-3xl font-semibold font-top -mt-5">
            CERTIFICATE OF COMPLETION
          </h1>
          <p className="text-xl mt-3 font-body">This is to certify that</p>
          <h2 className="text-3xl font-semibold uppercase font-name">
            {props.name}
          </h2>
          <p className="text-xl font-body">has successfully completed the course</p>
          <h2 className="capitalize text-2xl font-semibold font-body">
            {props.title}
          </h2>
          <p className="text-xl font-body">
            during the period from
            <span className="font-semibold font-body"> {formatDate(props.enrolled_at)}</span> to
            <span className="font-semibold"> {formatDate(props.completed_at)}</span>
          </p>
        </div>
        <div className="flex items-start justify-between w-full mt-6">
          <p className="text-sm font-semibold font-body">
            Certificate ID: <span className='uppercase'>{props.cid}</span>
          </p>
          <p className="text-sm font-semibold font-body">
            Reference Number: 0{props.ref}
          </p>
        </div>
      </div>
      <button className="p-3 cursor-pointer bg-blue-500 text-white rounded-lg text-xl" onClick={downloadPDF}>
        Download
      </button>
    </div>
    </>
  );
}

export default GenerateCertificate;
