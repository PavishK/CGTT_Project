import { verifyJWTWebToken} from '../middlewares/JWTMiddleware.js';


export const sessionCheck=(req,res)=>{
    //console.log("Session Check -> ",req.signedCookies);
    try {
        const {jwttoken}=req.signedCookies;
        if(!jwttoken)
            return res.status(401).json({message:"Please login to continue!"});
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