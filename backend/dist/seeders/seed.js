// import bcrypt from "bcryptjs";
// import { connectDB } from "../config/db.js";
// import User from "../models/User.js";
// import mongoose from "mongoose";
export {};
//\\ const DummyUser = [
//     {
//       "name": "Trishit Bhowmik",
//       "email": "trishit@example.com",
//       "password": "Password123!"
//     },
//     {
//       "name": "John Smith",
//       "email": "j.smith@email-provider.net",
//       "password": "SecureP@ssw0rd"
//     },
//     {
//       "name": "Alex Johnson",
//       "email": "alex.johnson@web-mail.org",
//       "password": "myStr0ngPassword$"
//     }
//   ]
// export async function seedUser() {
//     await connectDB();
//     const user = await User.findOne();
//             if(!user){    
//     for(const dUser of DummyUser){
//             const salt = await bcrypt.genSalt(10);
//             const hashedPassword = await bcrypt.hash(dUser.password,salt);
//             //dUser.password = hashedPassword;
//             await User.create({...dUser,password:hashedPassword});
//             console.log(`${dUser.name} is created successfully`);
//         }
//     }
//     else{
//         console.log('user is not created');
//     }
//     await mongoose.disconnect()
// }
//# sourceMappingURL=seed.js.map