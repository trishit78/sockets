
import jwt from 'jsonwebtoken';
import type { Request,Response,NextFunction } from "express";
import { authConfig } from '../config/index.js';
import User from '../models/User.js';

export const authMiddleware = async (req:Request,res:Response,next:NextFunction)=>{
    const token = req.header("Authorization")?.replace("Bearer ","").trim()
    if(!token){
        res.status(401).send('Access denied');
        return;
    }
    try {
        //if (!token) return;
        const decoded = jwt.verify(token, authConfig.JWT_SECRET as string);

        // Ensure decoded is a JwtPayload and has an 'id' property
        const userId = (typeof decoded === 'object' && decoded !== null && 'id' in decoded) ? (decoded as any).id : null;
        if (!userId) {
            res.status(401).send('Invalid token payload');
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(401).send('Status not found');
            return;
        }

        (req as any).user = user;
        next();
    } catch (error) {
        res.status(401).send('Invalid token');
    }


}