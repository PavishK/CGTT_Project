import db from '../db/dbConnection.js';
import {verifyPassword} from '../middlewares/passwordMiddleware.js';

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