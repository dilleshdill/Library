import jwt from "jsonwebtoken";

const generateUserToken = (res,user)=>{
    const token =  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    res.cookie("user_token", token, {
        httpOnly: true,  // Prevents JavaScript from accessing the cookie
        sameSite: "None", // Required for cross-site cookies
        secure: true, 
        path: "/",
        maxAge: 3 * 24 * 60 * 60 * 1000 
    });
    return token
}

export default generateUserToken