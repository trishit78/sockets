import { type Request,type Response } from "express";
import { loginService, registerService } from "../service/authService.js";
import User from "../models/User.js";

export async function registerController(req:Request,res:Response) {
    try {
        const {user,token} = await registerService(req.body);
        return res.status(201).json({
            success:true,
            data:{user,token},
            error:null,
            message:"Register successfully"
        })
    } catch (error) {
        console.log('Error in controller',error);
        
    }
}

export async function loginController(req:Request,res:Response) {
    try {
        const {user,token} = await loginService(req.body);
        return res.status(201).json({
            success:true,
            data:{user,token},
            error:null,
            message:"Register successfully"
        })
    } catch (error) {
        console.log('Error in controller',error);
    }
}

export async function profileRouter(req: Request, res: Response) {
    try {
    
        const userId = (req as any).user?.id 
        if (!userId) {
            return res.status(401).json({
                success: false,
                data: null,
                error: "Unauthorized - user id not found",
                message: "Unauthorized"
            });
        }
        const userData = await User.findById(userId).select('-password'); 
        if (!userData) {
            return res.status(404).json({
                success: false,
                data: null,
                error: "User not found",
                message: "User not found"
            });
        }
        res.status(200).json({
            data: userData,
            success: true,

        })
    }catch(error){
        console.log('Error in profile controller');
    }
}