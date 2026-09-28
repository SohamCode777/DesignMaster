import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";


const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, name, email`,
            [name, email, hashedPassword]
        );

        return res.status(201).json({
            user: result.rows[0],
            message: "User registered successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Registration failed."
        });
    }
};


const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                userId: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "3h"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 3 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login successful."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Login failed."
        });
    }
};


const logoutUser = (req, res) => {

    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    });

    return res.status(200).json({
        message: "Logged out successfully."
    });
};


const getCurrentUser = async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT id, name, email FROM users WHERE id = $1",
            [req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.status(200).json({
            user: result.rows[0],
            message: "User found"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Failed to get user."
        });
    }
};


const updateUserDetails = async (req, res) => {

    try {

        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required."
            });
        }

        const existingUser = await pool.query(
            `SELECT id
             FROM users
             WHERE email = $1
             AND id != $2`,
            [email, req.userId]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email is already in use."
            });
        }

        const result = await pool.query(
            `UPDATE users
             SET name = $1,
                 email = $2
             WHERE id = $3
             RETURNING id, name, email`,
            [name, email, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.status(200).json({
            user: result.rows[0],
            message: "Account details updated."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Failed to update account details."
        });
    }
};


const changePassword = async (req, res) => {

    try {

        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "Password is required."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `UPDATE users
             SET password = $1
             WHERE id = $2
             RETURNING id`,
            [hashedPassword, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.status(200).json({
            message: "Password changed successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Failed to change password."
        });
    }
};


export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateUserDetails,
    changePassword
};