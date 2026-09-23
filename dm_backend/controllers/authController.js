import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";


const registerUser = async (req, res) => {
    try{ // registration logic will go here
    const {name, email, password} = req.body.user;

    const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1", [email]
    );

    if(existingUser.rows.length>0){

         return res.status(409).json({
             message: "User already exists. Please log in."
        });
        
    }


    //hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    //new user created

    const newUser = await pool.query(
        `INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id`,
            [name,email,hashedPassword]
    );

    const userId = newUser.rows[0].id;

    //token generation

    const token = generateToken(userId);

    res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 3 * 60 * 60 * 1000
    });

    return res.status(201).json({
        message: "Registration successful"
    });

}

    catch(error){
        console.error(error);

       return res.status(500).json({
            message: "Something went wrong"
        });

    }
   
};


const loginUser = async (req,res) => {
    //Login logic here
    try{
        const {email, password} = req.body.userLogin;

    //check if user exists or not

    const existingUser = await pool.query(
        "SELECT id, password FROM users WHERE email = $1", [email]
    );

    if(existingUser.rows.length===0){

         return res.status(401).json({
             message: "Invalid email or password"
        });
        
    }


    const userId = existingUser.rows[0].id;
    const hashedPassword = existingUser.rows[0].password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if(!passwordMatch){
        return res.status(401).json({
             message: "Invalid email or password"
        });
    }


    const token = generateToken(userId);

    res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 3 * 60 * 60 * 1000
    });

    return res.status(200).json({
        message: "Login successful"
    });

    }
    catch(error){

         console.error(error);

       return res.status(500).json({
            message: "Something went wrong"
        });


    }

    

};



// getting current user details

const getCurrentUser = async (req,res) =>{
 try {
    const userId = req.userId;

    const currentUser = await pool.query(
        `SELECT id, name, email FROM users WHERE id = $1`, [userId]
    );

    if(currentUser.rows.length===0){
        return res.status(404).json({
            message:"User not found"
        });
    }

    const user = currentUser.rows[0];

    return res.status(200).json({
        user: user,
        message:"User found"
    });



 } catch (error) {

    console.error(error);

    return res.status(500).json({
        message:"Something went wrong"
    });
    
 }
    
};



//Log Out

const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    });

    return res.status(200).json({
        message: "Logout successful"
    });
};





export { registerUser, loginUser, getCurrentUser, logoutUser };