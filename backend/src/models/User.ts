import mongoose, { Document } from "mongoose";

export interface IUser extends Document{
    email:String,
    name:String,
    password:String,
    createdAt:Date,
    updatedAt:Date
}


const userSchema = new mongoose.Schema<IUser>(
    {
        email:{
            type:String,
            required:[true,'Email is required'],
            
        },
        name:{
            type:String,
            required:[true,'Name is required'],
        },
        password:{
            type:String,
            required:[true,"Password is required"],
            minLength:8,

        },
    },
    {timestamps:true}
);

const User = mongoose.model('User',userSchema);

export default User;
