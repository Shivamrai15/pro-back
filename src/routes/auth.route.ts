import { Router } from "express";
import { ApiError } from "../utils/api-error";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/api-response";
import { verifyJWT } from "../middlewares/auth.middleware";
import { generateAccessAndRefreshToken } from "../controllers/user.controller";

export const authRouter = Router();

authRouter.post("/register", async(req, res)=>{
    try {
        
        const { email, password } = req.body;
        
        if (!email || !password) {
            throw new ApiError(400, "field are required");
        }

        const existingUser  = await User.findOne({
            email
        });

        if (existingUser) {
            throw new ApiError(409, "User with email or username already exist");
        }
        const user = await User.create({
            email,
            password
        });

        if (!user) {
            throw new ApiError(500, "Internal server error");
        }

        const constrainedUser = {
            _id : user._id,
            fullname : user.fullname,
            email : user.email,
            createdAt : user.createdAt,
            updatedAt: user.updatedAt
        }

        return res.status(201).json(
            new ApiResponse(200, constrainedUser, "User has been created successfully")
        );

    } catch (error) {
        return res.send("Internal server error").status(500);
    }
});



authRouter.post("/login", async(req, res)=>{
    try {

        const { email, password } = req.body;

        if (!email) {
            throw new ApiError(400, "Email is required");
        }

        const user = await User.findOne({
            email
        });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // @ts-ignore
        const isPasswordCorrect = await user.isPasswordCorrect(password);

        if (!isPasswordCorrect) {
            throw new ApiError(401, "Incorrect Password");
        }

        const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id);
        
        const loggedInUser = {
            _id : user._id,
            fullname : user.fullname,
            email : user.email,
            createdAt : user.createdAt,
            updatedAt: user.updatedAt
        }

        const options  = {
            httpOnly : true,
            secure : true,
            sameSite: "None",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }

        return res
        .status(200)
        // @ts-ignore
        .cookie("accessToken", accessToken, options)
        // @ts-ignore
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, loggedInUser, "User has been loggedIn successfully")
        )
        
    } catch (error) {
        return res.send("Internal server error").status(500);
    }
});


authRouter.get("/logout", verifyJWT, async(req, res)=>{
    try {
        
        await User.findByIdAndUpdate(
                //@ts-ignore 
                req.user._id,
                    {
                        $set : {
                            refreshToken : undefined
                        }
                    },
                    {
                        new : true
                    }
                );
            
                const options  = {
                    httpOnly : true,
                    secure : process.env.NODE_ENV === 'production',
                    sameSite: false
                }
            
                return res
                .status(200)
                .clearCookie("refreshToken", options)
                .clearCookie("accessToken", options)
                .json(new ApiResponse(200, {}, "User logged out successfullly"));

    } catch (error) {
        return res.send("Internal server error").status(500);
    }
});


authRouter.get("/me", verifyJWT, async(req, res)=>{
    try {
        // @ts-ignore
        const user = await User.findById(req.user._id).select("-password -refreshToken");
        return res
                .status(200)
                .json(new ApiResponse(200, user, "User Data"));

    } catch (error) {
        
    }
})
