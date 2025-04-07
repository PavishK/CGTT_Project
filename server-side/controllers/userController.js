import db from '../db/dbConnection.js'
import { hashPassword, verifyPassword } from '../middlewares/passwordMiddleware.js';

export const userRegistration=async(req,res)=>{

  try {

    const {name,email,password}=req.body;
    let password_hash=await hashPassword(password);
    let sql=`INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`;
    db.query(sql,[name,email,password_hash],(err,result)=>{
        if(err)
          return res.status(500).json({message:err});
        return res.status(201).json({message:'User registered Successfully!'});
    });
    
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}

export const userLogin=(req,res)=>{

  try {

    const {name, email, password}=req.body;

    let sql=`SELECT * FROM users WHERE (name = ? OR email= ?)`;

    db.query(sql,[name,email],async(err,result)=>{
      if(err)
        return res.status(500).json({message:"Invalid User Data!"});
      if(result.length==0)
        return res.status(401).json({message:"Invalid User Name or Email!"});
      
      //console.log(result[0])

      const userData=result[0];
      const isMatch=await verifyPassword(userData.password_hash,password);

      if(!isMatch) return res.status(401).json({message:"Invalid Password!"});

      return res.status(201).json({message:"User Verified Successfully!"});
    });
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:error.message});
  }

}