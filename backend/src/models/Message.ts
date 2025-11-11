import type { Document, Types } from "mongoose";
import mongoose, { model, Schema } from "mongoose";

export interface IMessage extends Document{
    content:String,
    senderId:Types.ObjectId,
    roomId:Types.ObjectId,
    createdAt:Date,
    readBy?:Types.ObjectId[]
}


const messageSchema = new mongoose.Schema<IMessage>({
    content:{
        type:String,
        required:true,
    },
    senderId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    roomId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Room'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    readBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});

messageSchema.index({roomId:1,createdAt:-1})

export const Message = model<IMessage>('Message',messageSchema);
