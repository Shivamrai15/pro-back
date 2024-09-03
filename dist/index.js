"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const app_1 = require("./app");
dotenv_1.default.config();
(0, db_1.default)()
    .then(() => {
    app_1.app.listen(process.env.PORT || 8080);
    console.log(`Server is running on http://localhost:${process.env.PORT || 8080}`);
})
    .catch((error) => {
    console.error("MongoDB Connection Error", error);
});
