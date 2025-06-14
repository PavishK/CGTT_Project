
export const storeUserData=(userData)=>{
        const data=JSON.stringify(userData);
        localStorage.setItem("user_data",data);
}


export const getUserData=()=>{
        const data=localStorage.getItem("user_data");
        if(!data)
                return false;
        return JSON.parse(data);
}

export const setOTPLimit=(OTPLimit)=>{
        const data=JSON.stringify(OTPLimit);
        localStorage.setItem('otpResendInfo',data);
}

export const getOTPLimit=()=>{
        const data=localStorage.getItem("otpResendInfo");
        if(!data)
                return false;
        return JSON.parse(data);
}

export const removeOTPLimit=()=>{
        localStorage.removeItem('otpResendInfo');
}

export const removeUserData=()=>{
        localStorage.clear();
}
