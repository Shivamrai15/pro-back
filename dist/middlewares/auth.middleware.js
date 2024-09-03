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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const api_error_1 = require("../utils/api-error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const verifyJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
        if (!token) {
            throw new api_error_1.ApiError(401, "Unauthorized request");
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // @ts-ignore
        const user = yield user_model_1.User.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken._id).select("-password -refreshToken");
        if (!user) {
            throw new api_error_1.ApiError(401, "Invalid Access Token");
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.log("Error", error);
        return res.send("Unauthorized").status(500);
    }
});
exports.verifyJWT = verifyJWT;
