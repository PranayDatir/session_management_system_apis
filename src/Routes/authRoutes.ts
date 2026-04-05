import express from 'express';
import authController from '../controllers/authController';

const router = express.Router();

router.post('/BatchUser/login', authController.login);

export default router;
