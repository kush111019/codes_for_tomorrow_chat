"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sessionStore_1 = __importDefault(require("../utils/sessionStore"));
const data_source_1 = require("../config/data.source");
const User_1 = require("../entities/User");
// export const authenticate = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): Promise<any> => {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({ message: "Not authenticated" });
//     }
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
//       console.log("decoded is : ",decoded)
//       // Check if the token matches the one stored in the session store
//       const validToken = sessionStore.get(decoded.id);
//       if (validToken !== token) {
//         return res.status(401).json({ message: "Session expired or invalid" });
//       }
//       // Attach user to request if needed
//       const userRepo = AppDataSource.getRepository(User);
//       const user = await userRepo.findOneBy({ id: decoded.id });
//       if (!user) return res.status(404).json({ message: "User not found" });
//       console.log("Incoming token:", token);
//       console.log("Session token in store:", sessionStore.get(decoded.id));
//       (req as any).user = user;
//       next();
//     } catch (err) {
//       return res.status(401).json({ message: "Invalid token" });
//     }
//   };
const authenticate = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res.status(401).json({ message: "Not authenticated" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const validToken = sessionStore_1.default.get(decoded.id);
        if (validToken !== token)
            return res.status(401).json({ message: "Session expired or invalid" });
        const user = await data_source_1.AppDataSource.getRepository(User_1.User).findOneBy({ id: decoded.id });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.authenticate = authenticate;
