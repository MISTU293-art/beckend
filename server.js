const express = require('express');
const mysql2=require('mysql2');
const cors=require('cors');
const env=require("dotenv").config();

const path=require('path');

const app=express();
// middleware
const PORT=process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.listen(PORT,()=>{
    console.log(`Server Running On Port ${PORT}`)
});
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"public","index.html"))
});

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectTimeout: 10000
});

    db.connect(err =>{
   if(err){
    console.log("Failed:Database Error");
    console.log(err);
   }
   else{
    console.log("Success:Database Connection Succeed");
   }
})

app.post("/add", (req, res) => {
    console.log("Body received:", req.body);
    const { name, studentId, department, subject1, subject2, subject3 } = req.body || {};

  

    const sql = "INSERT INTO result (name, studentId, department, subject1, subject2, subject3) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [name, studentId, department, subject1, subject2, subject3], (err, result) => {
        if (err) {
            console.error("MySQL Error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: "Marks Uploaded Successfully" });
        
    });
});
app.get('/view/:studentId', (req, res) => {

    const studentId = req.params.studentId;
    const sql = "SELECT * FROM result WHERE studentId = ?";

    db.query(sql, [studentId], (err, result) => {
        console.log("Result:",result);
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Server Error! Please try again later."
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Student Details Not Found!! Contact Your Teacher"
            });
        }

        res.json(result[0]);   
        console.log(result);
    });

});

app.get("/view/:studentId", (req, res) => {
    res.redirect('/');
});
