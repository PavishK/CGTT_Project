import CryptoJS from 'crypto-js';
const secretKey = import.meta.env.VITE_SECRET_KEY;

export const storeUserData=(userData)=>{
        const data=JSON.stringify(userData);
        const encrypted = CryptoJS.AES.encrypt(data, secretKey).toString();
        localStorage.setItem("dXNlcl9kYXRh",encrypted);
}


export const getUserData=()=>{
        const data=localStorage.getItem("dXNlcl9kYXRh");
        if(!data)
                return false;
        const bytes = CryptoJS.AES.decrypt(data, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted);
}

export const setOTPLimit=(OTPLimit)=>{
        const data=JSON.stringify(OTPLimit);
        const encrypted = CryptoJS.AES.encrypt(data, secretKey).toString();
        localStorage.setItem('b3RwUmVzZW5kSW5mbw==',encrypted);
}

export const getOTPLimit=()=>{
        const data=localStorage.getItem("b3RwUmVzZW5kSW5mbw==");
        if(!data)
                return false;
        const bytes = CryptoJS.AES.decrypt(data, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted);
}

export const removeOTPLimit=()=>{
        localStorage.removeItem('b3RwUmVzZW5kSW5mbw==');
}

export const removeUserData=()=>{
        localStorage.clear();
}
