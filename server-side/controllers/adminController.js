import db from '../db/dbConnection.js';

const verifyAdmin = async (adminData) => {
    const { _id, email } = adminData;
    const sql = `SELECT role FROM users WHERE _id = ? AND email = ?`;

    return new Promise((resolve, reject) => {
        db.query(sql, [_id, email], (err, result) => {
            if (err) return reject(err);
            if (result.length > 0 && result[0].role === 'admin') {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

// Manage Users

export const displayAllUsersInfo = async (req, res) => {
    try {
        const { _id, email } = req.params;
        if (!_id || !email)
            return res.status(402).json({ message: "Please login to continue." });

        const flag = await verifyAdmin({ _id, email });

        if (flag) {
            const sql = `SELECT _id, name, email, role FROM users`;
            db.query(sql, [], (err, result) => {
                if (err) throw new Error("Error while executing.");
                return res.status(201).json({ message: "Users data fetched.", data: result });
            });
        } else {
            throw new Error("Unauthorized access!");
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteUser=(req,res)=>{
    try {
        const {_id}=req.params;
        if(!_id)
            return res.status(401).json({message:'Unable to execute.'});
        let sql=`DELETE FROM users WHERE _id=?`;
        db.query(sql,[_id],(err,result)=>{
            if(err)
                throw new Error("Error while executing.");
        return res.status(201).json({message:'User deleted successfully!'});
        })
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const updateUser=(req,res)=>{
    try {
        const {_id}=req.params;
        const {email,role}=req.body;
        if(!_id || !email || !role)
            return res.status(401).json({message:"Unable to execute!"});
        let sql=`UPDATE users SET role=? WHERE _id=? and email=?`;
        db.query(sql,[role,_id,email],(err,result)=>{
            if(err)
                throw new Error("Error while executing!");
        return res.status(201).json({message:"User data updated successfully!"});
        })
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}


// Manage Course -x-
export const displayCoursesDatas=async(req,res)=>{
    try {
        const { _id, email } = req.params;
        if (!_id || !email)
            return res.status(402).json({ message: "Please login to continue." });

        const flag = await verifyAdmin({ _id, email });

        if (flag) {
            let sql=`
            SELECT * FROM courses;
            SELECT 
                courses.id,
                COUNT(tasks.course_id) AS taskCount 
            FROM 
                courses 
            LEFT JOIN tasks 
            ON tasks.course_id=courses.id 
            GROUP BY 
                courses.id;
            SELECT 
                courses.id,
                COUNT(enrollments.course_id) AS enrollmentCount 
            FROM 
                courses 
            LEFT JOIN enrollments 
            ON enrollments.course_id=courses.id 
            GROUP BY 
                courses.id;`;

            db.query(sql,(err,result,fields)=>{
                if(err)
                    console.log(err)
                const courses=result[0];
                const tasksCount=result[1];
                const enrollmentCount=result[2];
                const merged=courses.map((val)=>{
                    const match=tasksCount.find(i=>i.id===val.id)
                    return {...val,...match};
                });

                const finalMerge=merged.map((val)=>{
                    const match=enrollmentCount.find(i=>i.id===val.id)
                    return {...val,...match};
                })

                return res.status(200).json({message:'Courses data fetched.',data:{merged:finalMerge}});
            });
        }
        else
            throw new Error("Unauthorized access!");
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const deleteCourse=(req,res)=>{
    try {
        const {id}=req.params;
        if(!id)
            return res.status(401).json({message:"Unable to delete course."});
        let sql=`delete from courses where id= ?`;
        db.query(sql,[id],(err,result)=>{
            if(err)
                throw new Error("Error while executing.");
            return res.status(200).json({message:"Course deleted successfully!"});
        });
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const updateCourseData=(req,res)=>{
    try {
        const {id}=req.params;
        if(!id)
            return res.status(401).json({message:"Unable to u[date course."});
        const {title,image_url,description}=req.body;
        let sql=`update courses set title= ?, image_url= ?, description= ? where id= ?`;
        db.query(sql,[title,image_url,description,id],(err,result)=>{
            if(err)
                throw new Error("Error while executing.");
        return res.status(201).json({message:"Course data updated successfully!"});
        })

    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const addNewCourse=(req,res)=>{
    try {
        const {title,image_url,description}=req.body;
        if(!title || !image_url || !description)
            return res.status(401).json({message:"Unable to add new course."});
        let sql=`insert into courses (title,image_url,description) values (?, ?, ?);`;
        db.query(sql,[title,image_url,description],(err,result)=>{
            if(err)
                throw new Error("Error while executing.");
        return res.status(201).json({message:"New Course addes successfully."});
        })
    } catch (error) {
        return req.status(500).json({message:error.message});
    }
}

//-x-

//Manage Tasks -x-

export const displayCourseTasks=(req,res)=>{
    try {
        const {course_id}=req.params;
        if(!course_id)
            return res.status(401),json({message:"Course Id is missing."});
        let sql=`select * from tasks where course_id= ?`;
        db.query(sql,[course_id],(err,result)=>{
            if(err)
                throw new Error("Error while executing.");
        return res.status(200).json({message:"Tasks data fetched!",data:result});
        })
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const deleteCourseTask=(req,res)=>{
    try {
        const {id}=req.params;
        if(!id)
            return res.status(401).json({message:"Unable to execute."});
        let sql=`delete from tasks where id= ?;`;
        db.query(sql,[id],(err,result)=>{
            if(err)
                throw new Error("Error while executing.");
        return res.status(201).json({message:"Course task deleted successfully."});
        })
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const addNewCourseTask=(req,res)=>{
    try {
        const {title,description,course_id}=req.body;
        if(!title || !description)
            return res.status(401).json({message:"Unable to Add task."});

        let sql=`insert into tasks (title,course_id,description) values (?, ?, ?);`;
        db.query(sql,[title,course_id,description],(err,result)=>{
            if(err)
                throw new Error("Error while executing.");
        return res.status(201).json({message:"New Course task created."});
        })
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

//-x-

//Enrollments Manager

export const displayEnrollmentsData=async(req,res)=>{
    try {
        const { _id, email } = req.params;
        if (!_id || !email)
            return res.status(402).json({ message: "Please login to continue." });

        const flag = await verifyAdmin({ _id, email });

        if (flag) {
            let sql=`
            SELECT enrollments.id,users.name,users.email,courses.title,enrollments.enrollment_status,enrollments.course_completed 
            FROM enrollments JOIN users ON users._id=enrollments.user_id 
            JOIN courses ON courses.id=enrollments.course_id;
            `;

            db.query(sql,[],(err,result)=>{
                if(err)
                    throw new Error("Error while executing.");
                return res.status(201).json({message:"Enrollment datas fetched!",data:result});
            });            
        }        
        else
           return res.status(401).json({message:"Unauthorized Access!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const deleteEnrollmentData=(req,res)=>{
    try {
        const {id}=req.params;
        if(!id)
            return res.status(401).json({message:"Unable to delete Enrollment data."});
        let sql=`DELETE FROM enrollments WHERE id=?;`;
        db.query(sql,[id],(err,result)=>{
            if(err)
                throw new Error("Error while executing.");
            return res.status(201).json({message:"Enrollment data deleted successfully!"});
        })
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const acceptEnrollment=(req,res)=>{
    try {
        const {id}=req.body;
        if(!id)
            return res.status(401).json({message:"Unable to accept enrollmet."});
        let sql=`
        UPDATE enrollments SET enrolled_at=?, enrollment_status=? WHERE id=?;
        `;
        db.query(sql,[new Date(),1,id],(err,result)=>{
            if(err)
                throw new Error("Error while executing.");
            return res.status(201).json({message:"Enrollment Accepted!"});
        });
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const allowCourseCompletion=(req,res)=>{
    try {
        const {id}=req.body;
        if(!id)
            throw new Error("Missing Data.");
        let sql=`UPDATE enrollments SET course_completed=?, completed_at=? WHERE id=?`;
        db.query(sql,[1,new Date(),id],(err,result)=>{
            if(err)
                throw new Error("Error while executing.");
            return res.status(201).json({message:"Enrollment data updated."});
        });
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

// -X-

