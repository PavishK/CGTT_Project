import { verifyJWTWebToken} from '../middlewares/JWTMiddleware.js';
import db from '../db/dbConnection.js';

export const sessionCheck=async(req,res)=>{
    //console.log("Session Check -> ",req.signedCookies);
    try {
        const {jwttoken}=req.signedCookies;
        if(!jwttoken)
            return res.status(500).json({message:"Please login to continue!"});
        const data=verifyJWTWebToken(jwttoken);
        if(data.session==='invalid'){ 
        res.clearCookie('jwttoken');
        return res.status(401).json({message:"Session expired!",session:false});
        }
        return res.status(200).json({user_data:data.userdata,session:true});        
    } catch (error) {
        return res.status(500).json({message:error.message});
    }

}

export const SessionLogOut=async(req,res)=>{
    try{
        res.clearCookie('jwttoken',{httpOnly:true,secure:true, signed:true});
        return res.status(201).json({message:"Logged out successfully."});

    }catch(err){
        return res.status(500).json({message:err.message});

    }

}

//Check Admin

export const roleAuth=(req,res)=>{
  try {
    const {_id,role,name,email}=req.body;
    if(!_id)
      return res.status(402).json({message:"Please login to continue."});

    const sql=`select _id,name,email,role from users where _id= ? and name= ? and email = ? and role= ?`;

    db.query(sql,[_id,name,email,role],(err,result)=>{
    if(err)
        return res.status(403).json({message:'UnAuthorized access denied.'});

    return res.status(201).json({message:"Access granted.",user_data:result[0]});
    });

  } catch (error) {
      return res.status(403).json({message:error.message});
  }
}