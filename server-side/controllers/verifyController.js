import db from '../db/dbConnection.js';

export const verifyCertificate=(req,res)=>{
    try {
        const {cid}=req.params;
        if(!cid)
            return res.status(401).json({message:"Missing certificate ID."});
        let sql=`
        SELECT enrollments.*, certificates.ref, certificates.is_valid, certificates.cid, users.name, users.email, courses.image_url, courses.title
        FROM certificates JOIN enrollments ON certificates.enrollment_id=enrollments.id 
        JOIN users ON users._id=enrollments.user_id JOIN courses ON courses.id=certificates.course_id WHERE certificates.cid=?;
        `;

        db.query(sql,[cid],(err,result)=>{
            if(err)
                throw new Error("Error while executing.");
            return res.status(201).json({message:"Certificate found.",data:result});
        })
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}