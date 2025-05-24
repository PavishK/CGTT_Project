
const formatTimeStamp=(url)=>{

    const date=new Date();

    let hour=date.getHours()%12 || 12;
    let min=date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
    let sec=date.getSeconds();

    let ampm=date.getHours()>=12?'PM':'AM';

    let dateFormat=`${hour}:${min}:${sec} ${ampm}`;

    const gray='\x1b[90m';
    const green='\x1b[32m';
    const yellow='\x1b[33m'
    const reset='\x1b[0m';
    const blue='\x1b[34m\x1b[4m';

    console.clear();
    console.log('\n'+gray+dateFormat+yellow+" [node] "+reset+green+"index.js "+reset+gray+"Server is running on "+reset+blue+url+'\n'+reset);
}

export default formatTimeStamp;