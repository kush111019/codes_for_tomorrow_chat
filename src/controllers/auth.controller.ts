import {Request , Response} from "express" ;
import bcrypt from "bcryptjs" ;
import { AppDataSource } from "../config/data.source";
import { User } from "../entities/User";
import sessionStore from "../utils/sessionStore";
import { signToken }  from "../utils/jwt";
import { sign } from "jsonwebtoken";
import { env } from "../config/env";
import { IGetUserAuthInfoRequest } from "../types/express/";
import { validateOrReject } from 'class-validator';
import { UserRegisterDto } from '../dto/userRegister.dto';
import { UserLoginDto } from '../dto/userLogin.dto';
import { cache, io, socketMap } from "../index";
const activeSessions = new Map<string, string>();


export const registerHandler = async (req: Request, res: Response): Promise<any> => {
    const dto = Object.assign(new UserRegisterDto(), req.body);
  
    try {
      await validateOrReject(dto);
    } catch (error) {
      return res.status(400).json({ errors: error });
    }
  
    const { email, password, name } = dto;
    const repo = AppDataSource.getRepository(User);
  
    const existingUser = await repo.findOneBy({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newUser = repo.create({
      email,
      name,
      password: hashedPassword,
    });
  
    await repo.save(newUser);
  
    return res.status(201).json({ message: "User registered successfully" });
  };



export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    });
    req.session?.destroy(() => {});
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};



export const loginHandler = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    if (sessionStore.has(user.id)) {
      console.log("sessionStore is : ",sessionStore);
      sessionStore.delete(user.id);
      cache.delete(user.id.toString());
    }

    const token = sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    sessionStore.set(user.id, token);
    cache.set(user.id.toString(), user, 3600);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      maxAge: 3600000,
    });

    return res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getProfile = async (req: any, res: Response): Promise<any> => {
  const userIdOfSomeUser = req.query.id;

  const cached = cache.get(userIdOfSomeUser.toString());
  if (cached) {
    const { password, ...safeCachedUser } = cached;
    return res.json({ source: 'cache', user: safeCachedUser });
  }

  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ id: userIdOfSomeUser });

  if (!user) return res.status(404).json({ message: 'User not found' });

 
  const { password, ...safeUser } = user;

  cache.set(userIdOfSomeUser.toString(), safeUser, 3600);
  return res.json({ source: 'database', user: safeUser });
};



  

