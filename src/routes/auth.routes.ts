import { Router } from "express" ;
import {loginHandler , logout , getProfile , registerHandler} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
const router = Router() ;


router.post("/login",loginHandler)
router.post("/logout", authenticate,logout);
router.get("/profile" , authenticate,getProfile);
router.post("/register" , registerHandler);



export default router ;