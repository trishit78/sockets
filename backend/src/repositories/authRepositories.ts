import type { userRegisterDTO } from "../dtos/authDTO.js";
import User from "../models/User.js";



export async function create(userRegisterData:userRegisterDTO) {
    const userData = userRegisterData;
    
    const user = new User(userData);
    await user.save();
    return user;

}


export async function findByEmail(email:string) {
    return User.findOne({email});
}

