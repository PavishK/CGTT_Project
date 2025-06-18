const secretKey = import.meta.env.VITE_SECRET_KEY;

export const storeUserData=(userData)=>{
        const data=JSON.stringify(userData);
        const encrypted = window.btoa(data);
        localStorage.setItem("dXNlcl9kYXRh",encrypted);
}


export const getUserData=()=>{
        const data=localStorage.getItem("dXNlcl9kYXRh");
        if(!data)
                return false;
        const decrypted = window.atob(data).toString();;
        return JSON.parse(decrypted);
}

export const setOTPLimit=(OTPLimit)=>{
        const data=JSON.stringify(OTPLimit);
        const encrypted = btoa(data);
        localStorage.setItem('b3RwUmVzZW5kSW5mbw==',encrypted);
}

export const getOTPLimit=()=>{
        const data=localStorage.getItem("b3RwUmVzZW5kSW5mbw==");
        if(!data)
                return false;
        const decrypted = atob(data).toString();
        return JSON.parse(decrypted);
}

export const removeOTPLimit=()=>{
        localStorage.removeItem('b3RwUmVzZW5kSW5mbw==');
}

export const removeUserData=()=>{
        localStorage.clear();
}
