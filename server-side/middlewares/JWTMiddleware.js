import jwt from 'jsonwebtoken';

const secret=process.env.JWT_SECRET;

export const generateJWTWebToken=(payload)=>{
    return jwt.sign(payload,secret,{expiresIn:'2h'});
}

export const verifyJWTWebToken=(token)=>{
    try{
        const userdata=jwt.verify(token,secret);
        if(userdata)
            return {userdata,session:'valid'};    

    }catch(err){
        return {session:'invalid'};
    }
}