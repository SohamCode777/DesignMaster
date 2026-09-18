import express from "express";
import cors from "cors";
import "dotenv/config";

//app config

const app= express();

const port = process.env.PORT || 3000;

//middleware

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.get("/", (req,res)=>{
    res.send("Api working");
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})
