import express from 'express';
import sessionsController from '../controllers/sessionsController';
import verifyJWT from '../middleware/verifyJWT';

const router = express.Router();

router.post('/', verifyJWT.checkAuthWeb, sessionsController.create);
router.get('/', verifyJWT.checkAuthWeb, sessionsController.readAll);
router.get('/:id', verifyJWT.checkAuthWeb, sessionsController.readOne);
router.put('/:id', verifyJWT.checkAuthWeb, sessionsController.updateOne);
router.delete('/:id', verifyJWT.checkAuthWeb, sessionsController.deleteOne);
router.get('/by-batch/:batchId', verifyJWT.checkAuthWeb, sessionsController.getSessionByBatchId);

export default router;
