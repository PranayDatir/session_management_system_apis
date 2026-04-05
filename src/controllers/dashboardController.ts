import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Batch } from '../models/Batches';
import Users from '../models/Users';
import { BatchEnrollment } from '../models/BatchEnrollment';
import { BatchSession } from '../models/BatchSession';

const readAdminDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [totalBatches, activeBatches, totalCandidates, totalEnrollments, totalSessions] = await Promise.all([
            Batch.countDocuments(),
            Batch.countDocuments({ isActive: true }),
            Users.countDocuments(),
            BatchEnrollment.countDocuments(),
            BatchSession.countDocuments(),
        ]);

        return res.status(200).json({
            result: true,
            message: 'Admin dashboard data fetched successfully',
            data: {
                totalBatches,
                activeBatches,
                totalCandidates,
                totalEnrollments,
                totalSessions,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            result: false,
            message: 'Something went wrong',
            data: error,
        });
    }
};

const readBatchCandidatesDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [batches, enrollmentsByBatch] = await Promise.all([
            Batch.find().select('_id batchName isActive batchId isPublic').lean(),
            BatchEnrollment.aggregate([
                {
                    $group: {
                        _id: '$batchId',
                        totalCandidates: { $sum: 1 },
                    },
                },
            ]),
        ]);

        const enrollmentMap = new Map<string, number>();
        for (const item of enrollmentsByBatch) {
            enrollmentMap.set(String(item._id), item.totalCandidates);
        }

        const data = batches
            .map((batch: any) => ({
                batchId: batch.batchId ?? batch._id,
                batchName: batch.batchName,
                totalCandidates: enrollmentMap.get(String(batch._id)) ?? 0,
                isActive: batch.isActive ?? false,
                isPublic: batch.isPublic ?? false,
            }))
            .sort((a, b) => b.totalCandidates - a.totalCandidates);

        return res.status(200).json({
            result: true,
            message: 'Batch-wise candidate statistics fetched successfully',
            data,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            result: false,
            message: 'Something went wrong',
            data: error,
        });
    }
};

const readCandidateDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { candidateId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(candidateId)) {
            return res.status(200).json({
                result: false,
                message: 'Invalid candidateId',
            });
        }

        const enrollments = await BatchEnrollment.find({ candidateId })
            .select('batchId isActive')
            .lean();

        const enrolledBatchIds = Array.from(new Set(enrollments.map((item) => String(item.batchId))));
        const activeEnrollmentBatchIds = Array.from(
            new Set(
                enrollments
                    .filter((item) => item.isActive)
                    .map((item) => String(item.batchId))
            )
        );

        const [activeBatches, totalAvailableSessions] = await Promise.all([
            Batch.countDocuments({
                _id: { $in: activeEnrollmentBatchIds },
                isActive: true,
            }),
            BatchSession.countDocuments({
                batchId: { $in: activeEnrollmentBatchIds },
            }),
        ]);

        return res.status(200).json({
            result: true,
            message: 'Candidate dashboard data fetched successfully',
            data: {
                enrolledBatches: enrolledBatchIds.length,
                activeBatches,
                totalAvailableSessions,
                activeEnrollments: enrollments.filter((item) => item.isActive).length,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            result: false,
            message: 'Something went wrong',
            data: error,
        });
    }
};

export default { readAdminDashboard, readBatchCandidatesDashboard, readCandidateDashboard };
