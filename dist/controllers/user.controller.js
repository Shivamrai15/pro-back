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
exports.generateAccessAndRefreshToken = void 0;
const api_error_js_1 = require("../utils/api-error.js");
const user_model_js_1 = require("../models/user.model.js");
const generateAccessAndRefreshToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_js_1.User.findById(userId);
        if (!user) {
            throw new api_error_js_1.ApiError(500, "Something went wrong while generating tokens");
        }
        // @ts-ignore
        const accessToken = user.generateAccessToken();
        // @ts-ignore
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        yield user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new api_error_js_1.ApiError(500, "Something went wrong while generating tokens");
    }
});
exports.generateAccessAndRefreshToken = generateAccessAndRefreshToken;
