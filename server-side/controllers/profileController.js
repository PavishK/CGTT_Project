import db from '../db/dbConnection.js';
import { hashPassword, verifyPassword } from '../middlewares/passwordMiddleware.js';

export const getUserData=(req,res)=>{
    try {
        const {_id}=req.body;
        if(!_id)
            return res.status(400).json({message:"Missing data."});
        let sql=`SELECT * FROM users WHERE _id=?`;
        db.query(sql,[_id],(err,result)=>{
            if(err)
                return res.status(500).json({message:"Error while executing."});

            const {name,_id,full_name,created_at,email}=result[0];
            const passLength='*'.repeat(Math.floor(Math.random()*(15-8+1)+8));
            return res.status(200).json({message:"User Data Fetched.",data:{_id,name,full_name,created_at,email,passLength}})
        });
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const updateUserFullName=(req,res)=>{
    try {
        const {_id}=req.params;
        const {full_name}=req.body;

        if(!_id,!full_name)
            return res.status(400).json({message:"Missing Data."});
        let sql=`UPDATE users SET full_name=? WHERE _id=?;`;

        db.query(sql,[full_name,_id],(err,result)=>{
            if(err)
                return res.status(500).json({message:"Error while executing."});
            return res.status(200).json({message:"User full name updated."});
        });
        
    } catch (error) {
        return res.status(500).json({message:error.message});
    } 
}

export const deleteUserData=(req,res)=>{

    try {
        const {_id,name,email}=req.body;
        if(!_id || !name || !email)
            return res.status(400).json({message:"Missing data."});
        let sql=`SELECT * FROM users  WHERE _id=? AND name=? AND email=?;`;
        db.query(sql,[_id,name,email],(err,result)=>{
            if(err)
                return res.status(500).json({message:"Error while ececuting."});
            else{
                let sql=`DELETE FROM users WHERE _id=?;`;
                db.query(sql,[result[0]._id],(e,r)=>{
                    if(e) return res.status(500).json({message:"Error while executing 2nd query."});
                    return res.status(200).json({message:"User data removed."});
                });
            }
        });
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}


export const generateOTPForCP=(req,res)=>{

    try {
        const {_id,name,email}=req.body;
        if(!_id || !name ||!email)
            return res.status(400).json({message:"Missing data."});
        let sql=`SELECT * FROM users WHERE _id=? AND name=? AND email=?;`;
        db.query(sql,[_id,name,email],(err,result)=>{
            if(err) return res.status(500).json({message:"Error while executing."});
            else{
                const otp=Math.floor(100000+Math.random()*999999);
                return res.status(200).json({message:"OTP generated.",otp:otp});
            }
        });
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const checkValidPassword=(req,res)=>{
    try {
        const {_id,name,email,password}=req.body;
        if(!_id || !name || !email || !password)
            return res.status(400).json({message:"Missing data."});
        let sql=`SELECT password_hash FROM users WHERE _id=? AND name=? AND email=?;`;
        db.query(sql,[_id,name,email],async(err,result)=>{
            if(err) return res.status(500).json({message:"Error while executing."});
            else{
                const flag=await verifyPassword(result[0].password_hash,password);
                if(flag)
                    return res.status(200).json({message:"Valid password."});
                else
                    return res.status(400).json({message:"Invalid password."});
            }
        });
    } catch (error) {
        return res.status(500).json({messsage:error.message});
    }
}

export const changeUserPassword=(req,res)=>{
    try {
        const {_id}=req.params;
        const {name,email,newPassword}=req.body;

        if(!_id || !name || !email || !newPassword)
            return res.status(400).json({message:"Missing data."});
        let sql=`SELECT name FROM users WHERE _id=? AND name=? AND email=?;`;
        db.query(sql,[_id,name,email],async(err,result)=>{
            if(err) return res.status(500).json({message:"Error while executing."});
            else{
                let sql=`UPDATE users SET password_hash=? WHERE name=?;`;
                const hashed_password= await hashPassword(newPassword);
                db.query(sql,[hashed_password , result[0].name],(e,r)=>{
                    if(e) return res.status(500).json({message:"Error while executing."});
                    return res.status(201).json({message:"Password changed successfully."});
                })
            }
        })
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}