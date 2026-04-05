import express from 'express';
import userController from '../controllers/userController';
import verifyJWT from '../middleware/verifyJWT';

const router = express.Router();

router.post('/', verifyJWT.checkAuthWeb, userController.create);
router.get('/', verifyJWT.checkAuthWeb, userController.readAll);
router.get('/:id', verifyJWT.checkAuthWeb, userController.readOne);
router.put('/:id', verifyJWT.checkAuthWeb, userController.updateOne);
router.delete('/:id', verifyJWT.checkAuthWeb, userController.deleteOne);

export default router;
