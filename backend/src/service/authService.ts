import type { userLoginDTO, userRegisterDTO } from "../dtos/authDTO.js";
import bcrypt from "bcryptjs";
import { create, findByEmail } from "../repositories/authRepositories.js";

import { authConfig } from "../config/index.js";
import jwt from 'jsonwebtoken'


function signToken(userId:any){
    return jwt.sign(
        { id: userId },
        authConfig.JWT_SECRET,
        {
          expiresIn: authConfig.JWT_EXPIRES_IN,
          issuer: authConfig.JWT_ISSUER ,
          audience: authConfig.JWT_AUDIENCE,
        } 
      );
}

function comparePassword(password:string,comparePassword:any){
    return bcrypt.compare(password,comparePassword);
}


export async function registerService(userRegisterData:userRegisterDTO) {
    try {
        const userData = userRegisterData;
        console.log(userData);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password,10);
        userData.password = hashedPassword;
        const user = await create(userData);

        // Safely retrieve _id and ensure it's a string
        const userId = (user as any)?._id?.toString?.();
        if (!userId) {
            throw new Error("User ID is missing or invalid after user creation.");
        }

        const token = signToken(userId);
        return { user, token };
    }catch(error){
        console.log('Error in register service',error)
        throw error;
    }
}


export async function loginService(userLoginData:userLoginDTO) {
    try {
        const {email,password} = userLoginData;
        const user = await findByEmail(email);
        const ok = user && (comparePassword(password,user.password));
        if(!ok){
            throw new Error("Invalid email");
        }

        const userId = (user as any)?._id?.toString?.();
        if (!userId) {
            throw new Error("User ID is missing or invalid after user creation.");
        }

        const token = signToken(userId);
        return { user, token };


    } catch (error) {
        console.log('Error in loginService',error);
        throw error;
    }
}