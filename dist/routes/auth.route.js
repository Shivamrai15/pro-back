"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const api_error_1 = require("../utils/api-error");
const user_model_1 = require("../models/user.model");
const api_response_1 = require("../utils/api-response");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new api_error_1.ApiError(400, "field are required");
        }
        const existingUser = yield user_model_1.User.findOne({
            email
        });
        if (existingUser) {
            throw new api_error_1.ApiError(409, "User with email or username already exist");
        }
        const user = yield user_model_1.User.create({
            email,
            password
        });
        if (!user) {
            throw new api_error_1.ApiError(500, "Internal server error");
        }
        const constrainedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        return res.status(201).json(new api_response_1.ApiResponse(200, constrainedUser, "User has been created successfully"));
    }
    catch (error) {
        return res.send("Internal server error").status(500);
    }
}));
exports.authRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email) {
            throw new api_error_1.ApiError(400, "Email is required");
        }
        const user = yield user_model_1.User.findOne({
            email
        });
        if (!user) {
            throw new api_error_1.ApiError(404, "User not found");
        }
        // @ts-ignore
        const isPasswordCorrect = yield user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            throw new api_error_1.ApiError(401, "Incorrect Password");
        }
        const { refreshToken, accessToken } = yield (0, user_controller_1.generateAccessAndRefreshToken)(user._id);
        const loggedInUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };
        return res
            .status(200)
            // @ts-ignore
            .cookie("accessToken", accessToken, options)
            // @ts-ignore
            .cookie("refreshToken", refreshToken, options)
            .json(new api_response_1.ApiResponse(200, loggedInUser, "User has been loggedIn successfully"));
    }
    catch (error) {
        return res.send("Internal server error").status(500);
    }
}));
exports.authRouter.get("/logout", auth_middleware_1.verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_model_1.User.findByIdAndUpdate(
        //@ts-ignore 
        req.user._id, {
            $set: {
                refreshToken: undefined
            }
        }, {
            new: true
        });
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: false
        };
        return res
            .status(200)
            .clearCookie("refreshToken", options)
            .clearCookie("accessToken", options)
            .json(new api_response_1.ApiResponse(200, {}, "User logged out successfullly"));
    }
    catch (error) {
        return res.send("Internal server error").status(500);
    }
}));
exports.authRouter.get("/me", auth_middleware_1.verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const user = yield user_model_1.User.findById(req.user._id).select("-password -refreshToken");
        return res
            .status(200)
            .json(new api_response_1.ApiResponse(200, user, "User Data"));
    }
    catch (error) {
    }
}));
