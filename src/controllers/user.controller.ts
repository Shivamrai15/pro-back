import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.model.js";


export const generateAccessAndRefreshToken = async(userId: any) => {
    try {
        
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(500, "Something went wrong while generating tokens");
        }
        // @ts-ignore
        const accessToken = user.generateAccessToken();
        // @ts-ignore
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave : false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}