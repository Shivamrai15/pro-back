import { ApiError } from "../utils/api-error";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT = async(req:any, res: any, next:any)=>{
    try {

        const token  = req.cookies?.accessToken;
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    
        // @ts-ignore
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if (!user){
            throw new ApiError(401, "Invalid Access Token");
        }
    
        req.user = user;
        next();

    } catch (error) {
        console.log("Error", error);
        return res.send("Unauthorized").status(500);
    }
}