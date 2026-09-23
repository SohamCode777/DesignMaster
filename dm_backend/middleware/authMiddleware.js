import jwt from "jsonwebtoken"


const verifyAuthentication = (req,res,next) =>{
   try {

        //get token from cookies
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                message: "Not authenticated"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;
        
        next();

        
        
    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message:"Invalid or expired token"
        });
        
    }

};


export default verifyAuthentication;