import mongoose, { Document, type HydratedDocument } from "mongoose";
export interface IUser extends Document {
    email: String;
    name: String;
    password: String;
    createdAt: Date;
    updatedAt: Date;
}
export type UserDocument = HydratedDocument<IUser>;
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=User.d.ts.map