import { Request ,Response ,NextFunction } from "express";
import jwt from "jsonwebtoken" ;
import sessionStore  from "../utils/sessionStore";
import { AppDataSource } from "../config/data.source";
import { User } from "../entities/User";
import { IGetUserAuthInfoRequest } from "../types/express/";


export const authenticate = async (req: any, res: Response, next: NextFunction): Promise<any> => {
  
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const validToken = sessionStore.get(decoded.id);
    if (validToken !== token) return res.status(401).json({ message: "Session expired or invalid" });

    const user = await AppDataSource.getRepository(User).findOneBy({ id: decoded.id });
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};




