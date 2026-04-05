import express from 'express';
import batchController from '../controllers/batchController';
import verifyJWT from '../middleware/verifyJWT';

const router = express.Router();

router.post('/', verifyJWT.checkAuthWeb, batchController.create);
router.get('/', verifyJWT.checkAuthWeb, batchController.readAll);
router.get('/:id', verifyJWT.checkAuthWeb, batchController.readOne);
router.put('/:id', verifyJWT.checkAuthWeb, batchController.updateOne);
router.delete('/:id', verifyJWT.checkAuthWeb, batchController.deleteOne);

export default router;
