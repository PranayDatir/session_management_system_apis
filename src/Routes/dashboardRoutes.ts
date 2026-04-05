import express from 'express';
import dashboardController from '../controllers/dashboardController';
import verifyJWT from '../middleware/verifyJWT';

const router = express.Router();

router.get('/batch-candidates', verifyJWT.checkAuthWeb, dashboardController.readBatchCandidatesDashboard);
router.get('/candidate/:candidateId', verifyJWT.checkAuthWeb, dashboardController.readCandidateDashboard);
router.get('/GetAdminDashboard', verifyJWT.checkAuthWeb, dashboardController.readAdminDashboard);

export default router;
