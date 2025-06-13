import db from "../db/dbConnection.js";

export const displayCoursesDatas=(req,res)=>{
    try {
        let sql='select * from courses';
        db.query(sql,(err,result)=>{
            if(err)
                return res.status(401).json({message:"Unbale to display course datas!"});
            else
                return res.status(200).json({data:result});
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

        let sql=`select courses.*, enrollments.enrollment_status, enrollments.course_completed  from courses 
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

// Enrollment Request

export const requestEnrollment=(req,res)=>{
    try {
        const {user_id,course_id}=req.body;
        if(!user_id || !course_id)
            return res.status(400).json({message:"Unable to request enrollment."});
        let sql=`INSERT INTO enrollments (user_id,course_id) VALUES (?, ?);`
        db.query(sql,[user_id,course_id],(err,result)=>{
            if(err)
                return res.status(500).json({message:"Error while executing."});
            return res.status(201).json({message:"Enrollment requested successfully."});
        })

    } catch (error) {
     return res.status(500).json({message:error.message});   
    }
}

export const getCertificateData=(req,res)=>{
    try {
        const {user_id,course_id}=req.body;
        if(!user_id || !course_id)
            return res.status(400).json({message:"Missing data."});
        let sql=`SELECT * FROM enrollments WHERE user_id=? AND course_id=?;`
        db.query(sql,[user_id,course_id],(err,result)=>{
            if(err) return res.status(500).json({message:"Error while executing."});
            else{
                if(result[0].course_completed){
                    let sql='select cid,ref from certificates where user_id=? and course_id=? and enrollment_id=?';
                    db.query(sql,[user_id,course_id,result[0].id],(e,r)=>{
                        if(e) return res.status(500).json({message:"Error while executing."});
                    return res.status(201).json({data:{...result[0],...r[0]}});
                    });
                }
                else
                    return res.status(401).json({message:"Complete the course task to obtain certificate."});
            }
        });
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}