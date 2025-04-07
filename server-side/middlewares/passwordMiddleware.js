import argon2 from 'argon2';

export const hashPassword=async(password)=>{
    return await argon2.hash(password);
}

export const verifyPassword=async(password_hash,input_password)=>{
    return await argon2.verify(password_hash,input_password);
}