import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    email: String;
    name: String;
    password: String;
    createdAt: Date;
    updatedAt: Date;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, mongoose.Schema<IUser, mongoose.Model<IUser, any, any, any, mongoose.Document<unknown, any, IUser, any, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IUser, mongoose.Document<unknown, {}, mongoose.FlatRecord<IUser>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<IUser> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>>;
export default User;
//# sourceMappingURL=User.d.ts.map