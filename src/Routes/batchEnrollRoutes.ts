import express from 'express';
import batchEnrollController from '../controllers/batchEnrollController';
import verifyJWT from '../middleware/verifyJWT';

const router = express.Router();

router.post('/', verifyJWT.checkAuthWeb , batchEnrollController.create);
router.get('/GetAllEnrollment',verifyJWT.checkAuthWeb, batchEnrollController.readAll);
router.get('/by-candidate/:candidateId', verifyJWT.checkAuthWeb, batchEnrollController.getBatchEnrollmentByCandidateId);
router.get('/:id', verifyJWT.checkAuthWeb, batchEnrollController.readOne);
router.put('/:id', verifyJWT.checkAuthWeb, batchEnrollController.updateOne);
router.delete('/:id', verifyJWT.checkAuthWeb, batchEnrollController.deleteOne);

export default router;
