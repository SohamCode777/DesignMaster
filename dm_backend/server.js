import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js';
import pool from "./config/db.js";



//app config

const app= express();

const port = process.env.PORT || 3000;

//middleware

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser()); //allows express to use req.cookies(), res.cookie(), res.clearCookie()

//adding routes
app.use('/api/auth',authRoutes)

app.get("/", (req,res)=>{
    res.send("Api working");
});


// database test
pool.query("SELECT NOW()", (err, result) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Database connected:", result.rows[0]);
    }
});



app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})
