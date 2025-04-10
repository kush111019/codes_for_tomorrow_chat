"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.loginHandler = exports.logout = exports.registerHandler = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const data_source_1 = require("../config/data.source");
const User_1 = require("../entities/User");
const sessionStore_1 = __importDefault(require("../utils/sessionStore"));
const jsonwebtoken_1 = require("jsonwebtoken");
const class_validator_1 = require("class-validator");
const userRegister_dto_1 = require("../dto/userRegister.dto");
const index_1 = require("../index");
const activeSessions = new Map();
const registerHandler = async (req, res) => {
    const dto = Object.assign(new userRegister_dto_1.UserRegisterDto(), req.body);
    try {
        await (0, class_validator_1.validateOrReject)(dto);
    }
    catch (error) {
        return res.status(400).json({ errors: error });
    }
    const { email, password, name } = dto;
    const repo = data_source_1.AppDataSource.getRepository(User_1.User);
    const existingUser = await repo.findOneBy({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const newUser = repo.create({
        email,
        name,
        password: hashedPassword,
    });
    await repo.save(newUser);
    return res.status(201).json({ message: "User registered successfully" });
};
exports.registerHandler = registerHandler;
// export const loginHandler = async (req: Request, res: Response): Promise<any> => {
//   const { email, password } = req.body;
//   try {
//     const userRepo = AppDataSource.getRepository(User);
//     const user = await userRepo.findOne({ where: { email } });
//     if (!user) return res.status(401).json({ message: "Invalid credentials" });
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });
//     // Invalidate previous session
//     const oldSocketId = socketMap.get(email);
//     if (oldSocketId) {
//       io.to(oldSocketId).emit("forceLogout");
//       socketMap.delete(email);
//       activeSessions.delete(email);
//       cache.delete(email);
//     }
//     const token = sign({ id: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: "1h" });
//     const sessionId = req.session?.id || "";
//     sessionStore.set(user.id, token);
//     activeSessions.set(email, sessionId);
//     cache.set(email, { token, userId: user.id }, 3600);
//     // 🔐 Set token in HTTP-only cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // set true in production
//       maxAge: 60 * 60 * 1000, // 1 hour
//       sameSite: "strict",
//     });
//     return res.json({ message: "Login successful" });
//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });
        req.session?.destroy(() => { });
        return res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
exports.logout = logout;
// export const getUserProfile = async (req: IGetUserAuthInfoRequest, res: Response): Promise<any> => {
//   const userId = req.user?.id; // ✅ Get userId from JWT middleware
//   if (!userId) return res.status(401).json({ message: 'Unauthorized access' });
//   const cacheKey = `user-profile-${userId}`;
//   const cachedProfile = getCache(cacheKey);
//   if (cachedProfile) {
//     return res.json({ source: 'cache', data: cachedProfile });
//   }
//   const userRepo = AppDataSource.getRepository(User);
//   const user = await userRepo.findOne({ where: { id: userId } });
//   if (!user) return res.status(404).json({ message: 'User not found' });
//   setCache(cacheKey, user, 60 * 1000);
//   return res.json({ source: 'db', data: user });
// };
const loginHandler = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepo.findOne({ where: { email } });
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(401).json({ message: "Invalid credentials" });
        // Invalidate previous session if exists
        if (sessionStore_1.default.has(user.id)) {
            console.log("sessionStore is : ", sessionStore_1.default);
            sessionStore_1.default.delete(user.id);
            index_1.cache.delete(user.id.toString());
        }
        const token = (0, jsonwebtoken_1.sign)({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Store session and cache
        sessionStore_1.default.set(user.id, token);
        index_1.cache.set(user.id.toString(), user, 3600);
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // set to true in production
            maxAge: 3600000,
        });
        return res.json({ message: "Login successful" });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.loginHandler = loginHandler;
// controllers/profile.controller.ts
const getProfile = async (req, res) => {
    const userId = req.user.id;
    // Try cache first
    const cached = index_1.cache.get(userId.toString());
    if (cached) {
        return res.json({ source: 'cache', user: cached });
    }
    // Otherwise fetch from DB and update cache
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const user = await userRepo.findOneBy({ id: userId });
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    index_1.cache.set(userId.toString(), user, 3600);
    return res.json({ source: 'database', user });
};
exports.getProfile = getProfile;
