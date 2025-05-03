import db from "../db/dbConnection.js";

export const displayCoursesDatas=(req,res)=>{
    try {
        let sql='select * from courses';
        db.query(sql,(err,result)=>{
            if(err)
                return res.status(401).json({message:"Unbale to display course datas!"});
            else
                return res.status(201).json({data:result});
        })
    } catch (error) {
        return res.status(500).json({message:error.message});
        
    }
}


export const displayEnrolledCourseDatas=(req,res)=>{
    try {
        const {id}=req.params;
        if(!id)
            return res.status(401).json({message:"Login to enroll courses!"});

        let sql=`select courses.* from courses 
                join enrollments on courses.id=enrollments.course_id
                 where user_id = ?`;

        db.query(sql,[id],(err,result)=>{
            if(err)
                return res.status(401).json({message:err.message});
            else
            return res.status(201).json({data:result});
        })
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}