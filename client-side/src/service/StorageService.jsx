
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

export const removeUserData=()=>{
        localStorage.clear();
}
