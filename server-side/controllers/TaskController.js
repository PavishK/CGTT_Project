import db from "../db/dbConnection.js";


export const sendCourseTasks=(req,res)=>{
    try {
        const {id}=req.params;
        if(!id || id.trim()=='')
            return res.status(401).json({message:"Unable to get course tasks!"});
        let sql='select * from tasks where course_id= ?';
        db.query(sql,[id],(err,result)=>{
            if(err)
                throw new Error("Unable to get course tasks!");
            else{
                if(result.length===0)
                    return res.status(200).json({message:"No tasks!"});
                else
                    return res.status(201).json(result);
            }
        });
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}