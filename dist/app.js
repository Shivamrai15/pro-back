"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_1 = require("./routes/auth.route");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json({
    limit: "16kb",
}));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: "16kb"
}));
app.use((0, cookie_parser_1.default)());
app.use('/', express_1.default.static(path_1.default.join(__dirname, '../public')));
console.log(path_1.default.join(__dirname, '../public'));
app.use("/api/v1/auth", auth_route_1.authRouter);
