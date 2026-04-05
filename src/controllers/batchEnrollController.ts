import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { BatchEnrollment, IBatchEnrollment } from '../models/BatchEnrollment';

const create = async (req: Request, res: Response, next: NextFunction) => {
    const {
        batchId,
        candidateId,
        enrollmentDate,
        isActive,
    } = req.body as unknown as IBatchEnrollment;

    const valuesArray = {
        batchId,
        candidateId,
        enrollmentDate,
        isActive,
    };
    var updater: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(valuesArray as IBatchEnrollment)) {
        if (value != undefined && value != "") {
            updater[key] = value;
        }
    }
    try {
        const batchEnrollment = new BatchEnrollment({
            _id: new mongoose.Types.ObjectId(),
            ...updater,
        });
        const result = await batchEnrollment.save();
        console.info(result);
        return res.status(201).json({
            data: result,
            result: true,
            message: "Enrollment added successfully.",
        });
    } catch (error: any) {
        console.error(error);
        let message = "Unknown Error!";
        if (!!error["code"]) {
            const idx = error["index"];
            const keys = Object.keys(error["keyValue"]);
            const values = Object.values(error["keyValue"]);
            message =
                error["code"] == 11000
                    ? `Candidate is already enrolled in this batch`
                    : "Unknown Error!";
        }

        return res.status(200).json({ result: false, message: message });
    }
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await BatchEnrollment.find().populate("batchId").populate("candidateId");
        return res
            .status(200)
            .json({ data: data, result: true, message: "Enrollments found" });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ data: error, result: false, message: "something went wrong" });
    }
};

const readOne = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
        const data = await BatchEnrollment.findById(id);
        return data
            ? res
                .status(201)
                .json({ data: data, result: true, message: "Enrollment Found" })
            : res.status(200).json({ result: false, message: "Enrollment not found" });
    } catch (error) {
        console.error(error);
        return res
            .status(200)
            .json({ data: error, result: false, message: "Something Went wrong!" });
    }
};

const updateOne = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const {
        batchId,
        candidateId,
        enrollmentDate,
        isActive,
    } = req.body as IBatchEnrollment;

    const valuesArray = {
        batchId,
        candidateId,
        enrollmentDate,
        isActive,
    };

    var updater: { [key: string]: any } = {};

    for (const [key, value] of Object.entries(valuesArray as IBatchEnrollment)) {
        if (value === true || value === false) {
            // for boolean specific values
            updater[key] = value;
        }
        if (value != undefined && value != "") {
            updater[key] = value;
        }
    }
    try {
        const updatedModel = await BatchEnrollment.findByIdAndUpdate({ _id: id }, updater);
        return res
            .status(200)
            .json({ data: updatedModel, result: true, message: "Enrollment updated." });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ data: error, result: false, message: "Something went wrong" });
    }
};

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
        const data = await BatchEnrollment.findByIdAndDelete(id);
        return data
            ? res
                .status(200)
                .json({ data: data, result: true, message: "Enrollment Deleted" })
            : res.status(200).json({ result: false, message: "Enrollment not found" });
    } catch (error) {
        console.error(error);
        return res
            .status(200)
            .json({ data: error, result: false, message: "Something Went wrong!" });
    }
};

const getBatchEnrollmentByCandidateId = async (req: Request, res: Response, next: NextFunction) => {
    const candidateId = req.params.candidateId;
    try {
        const data = await BatchEnrollment.find({ candidateId: candidateId }).populate("batchId").populate("candidateId");
        return res
            .status(200)
            .json({ data: data, result: true, message: "Enrollments found" });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ data: error, result: false, message: "something went wrong" });
    }
}

export default { create, readAll, readOne, deleteOne, updateOne, getBatchEnrollmentByCandidateId };