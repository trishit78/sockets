import mongoose, { Types } from "mongoose";


export interface IMembership extends Document{
    userId:Types.ObjectId,
    roomId:Types.ObjectId,
    joinedAt:Date,
    lastSeen?:Date,

}


const membershipSchema = new mongoose.Schema<IMembership>(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        roomId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Room',
            required:true
        },
        joinedAt:{
            type:Date,
            default:Date.now
        },
        lastSeen:{
            type:Date,
        }
    }

)

membershipSchema.index({userId:1,roomId:1},{unique:true});


export const Membership = mongoose.model<IMembership>('MemberShip',membershipSchema);
