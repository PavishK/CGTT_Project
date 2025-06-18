import db from '../db/dbConnection.js'
import { hashPassword, verifyPassword } from '../middlewares/passwordMiddleware.js';
import {generateJWTWebToken} from '../middlewares/JWTMiddleware.js';

const cookiesConfig={httpOnly:true,secure:true,maxAge:2 * 60 * 60 * 1000, signed:true, sameSite: 'None',};

import axios from 'axios';

const verifyTurnstileToken=async(token)=>{
  try {
    const response = await axios.post(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      new URLSearchParams({
        secret: process.env.CLOUDFLARE_SECRET_KEY,
        response: token,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { success } = response.data;
    if (!success) {
      
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}


export const userRegistration = async (req, res) => {
  try {
    const { name, email, password, turnstileToken } = req.body;

    if (!turnstileToken) {
      return res.status(400).json({ message: "Verification failed. Please refresh the page." });
    }

    // Verify turnstile token before DB operation
    const isTurnstileValid = await verifyTurnstileToken(turnstileToken);
    if (!isTurnstileValid) {
      return res.status(400).json({ message: "Verification failed. Please refresh the page." });
    }

    const password_hash = await hashPassword(password);

    const sqlInsert = `INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`;
    db.query(sqlInsert, [name, email, password_hash], (err, insertResult) => {
      if (err) return res.status(500).json({ message: "This email is already registered." });

      const _id = insertResult.insertId;

      const sqlSelect = `SELECT * FROM users WHERE _id = ?`;
      db.query(sqlSelect, [_id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });

        const { name, email, role, full_name } = result[0];

        const token = generateJWTWebToken({ _id, name, email, role });
        res.cookie("jwttoken", token, cookiesConfig);

        return res.status(201).json({ message: "User registered Successfully!",user_data:{_id:_id,name:name,email:email,role:role},path:"/",full_name:full_name});
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const userLogin=(req,res)=>{

  try {

    const {name, email, password, turnstileToken}=req.body;

    if(!turnstileToken)
      return  res.status(400).json({ message: "Verification failed. Please refresh the page." });


    let sql=`SELECT * FROM users WHERE (name = ? OR email= ?)`;

    db.query(sql,[name,email],async(err,result)=>{
      if(err)
        return res.status(500).json({message:"Invalid User Data!"});
      if(result.length==0)
        return res.status(401).json({message:"Invalid User Name or Email!"});
      
      const userData=result[0];
      const isMatch=await verifyPassword(userData.password_hash,password);

      if(!isMatch) return res.status(401).json({message:"Invalid Password!"});

      const isTurnstileValid=await verifyTurnstileToken(turnstileToken);
      if(!isTurnstileValid)
        return res.status(400).json({ message: "Verification failed. Please refresh the page." });
  

      const {_id,name,email,role,full_name}=userData;
      res.cookie("jwttoken",generateJWTWebToken({_id:_id,name:name,email:email,role:role, full_name:full_name}),cookiesConfig);
      return res.status(201).json({message:"User Verified Successfully!",user_data:{_id:_id,name:name,email:email,role:role,full_name:full_name}, path:"/"});
    });
    
  } catch (error) {
    return res.status(500).json({message:error.message});
  }

}

import { newPassword } from '../middlewares/generatePassword.js';
import { resetMail } from './EmailController.js';

export const resetPassword = async (req, res) => {
  try {
    const { ID } = req.body;

    if (!ID) {
      return res.status(400).json({ message: "Missing user ID or email." });
    }

    const sql = `SELECT email FROM users WHERE name = ? OR email = ?;`;

    db.query(sql, [ID, ID], async (err, result) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).json({ message: "Error while querying the database." });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "No user found with the provided ID or email." });
      }

      const userEmail = result[0].email;
      const plainPassword = newPassword();
      const mailSent = await resetMail(plainPassword, userEmail);

      if (!mailSent) {
        return res.status(500).json({ message: "Failed to send reset email." });
      }

      const hashedPassword = await hashPassword(plainPassword);
      const updateSql = `UPDATE users SET password_hash = ? WHERE email = ?;`;

      db.query(updateSql, [hashedPassword, userEmail], (updateErr) => {
        if (updateErr) {
          console.error("Update Error:", updateErr);
          return res.status(500).json({ message: "Error while updating password." });
        }

        return res.status(200).json({ message: "Password reset successfully. Please check your email." });
      });
    });
  } catch (error) {
    console.error("Reset Error:", error);
    return res.status(500).json({ message: error.message });
  }
};
