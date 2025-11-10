import express from 'express';
import { loginController, profileRouter, registerController } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/register',registerController);
authRouter.post('/login',loginController);
authRouter.get('/me',authMiddleware,profileRouter);

export default authRouter;