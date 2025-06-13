import db from "../db/dbConnection.js";


export const sendCourseTasks=(req,res)=>{
    try {
        const {id}=req.params;
        if(!id || id.trim()=='')
            return res.status(401).json({message:"Unable to get course tasks!"});
        let sql='select * from tasks where course_id= ?';
        db.query(sql,[id],(err,result)=>{
            if(err)
                return res.status(500).json({message:"Error while executing."});
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

//Submit task

export const submitTask=(req,res)=>{
    try {
        const {user_id,task_id,fileLink}=req.body;
        if(!user_id || !task_id || !fileLink)
            return res.status(401).json({message:"Missing data."});
        let sql=`INSERT INTO submissions (user_id, task_id,file_url) VALUES (?, ?, ?);`;
        db.query(sql,[user_id,task_id,fileLink],(err,result)=>{
            if(err)
                return res.status(500).json({message:"Error while executing."});
        return res.status(201).json({message:"Submited successfully!"});
        })
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const submissionStatus=(req,res)=>{
    try {
        const {task_id,user_id}=req.params;
        if(!task_id || !user_id)
            return res.status(401).json({message:"Missing data."});
        let sql=`
         SELECT submissions.* FROM submissions 
         JOIN tasks ON submissions.task_id=tasks.id WHERE submissions.user_id=? AND tasks.id=?;`;
        db.query(sql,[user_id,task_id],(err,result)=>{
            if(err)
                return res.status(500).json({message:"Error while executing."});
        return res.status(201).json({message:"Data found!",data:result});
        })

    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const deleteSubmission=(req,res)=>{
    try {
        const {id}=req.params;
        if(!id)
            return res.status(401).json({messsage:"Missing data."});
        let sql=`DELETE FROM submissions WHERE id=?;`;
        db.query(sql,[id],(err,result)=>{
            if(err)
                return res.status(500).json({message:"Error while executing."});
            return res.status(201).json({message:"Data deleted."});
        })
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const getUserSubmissions=(req,res)=>{
    try {
        const {_id}=req.params;
        if(!_id)
            return res.status(400).json({message:"Missing data."});
        let sql=`
         SELECT submissions.status, tasks.title, submissions.file_url ,submissions.submited_at ,courses.title AS course_name 
         FROM submissions JOIN tasks ON submissions.task_id=tasks.id 
         JOIN courses ON courses.id=tasks.course_id JOIN users ON users._id=?;
         `;
         db.query(sql,[_id],(err,result)=>{
            if(err) return res.status(500).json({message:"Error while executing."});
            return res.status(200).json({message:"Data fetched.",data:result});
         });
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}