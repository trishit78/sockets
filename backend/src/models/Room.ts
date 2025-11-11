import mongoose, { Document } from "mongoose";


export interface IRoom extends Document{
    name:String | null,
    isPrivate:Boolean,
    privateId:String | null,
    createdAt:Date
}





const roomSchema = new mongoose.Schema<IRoom>({
    name:{
        type:String ,
        required:false,
        default:null,
    },
    isPrivate:{
        type:Boolean,
        default:false
    },
    privateId:{
        type:String,
        default:null,
    }
},{
    timestamps:true
})


export const Room = mongoose.model('Room',roomSchema);


