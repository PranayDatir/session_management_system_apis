import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { BatchSession, IBatchSession } from '../models/BatchSession';
import { get } from 'http';

const create = async (req: Request, res: Response, next: NextFunction) => {
    const {
        batchId,
        topicName,
        topicDescription,
        youtubeVideoId,
        durationInMinutes,
        sessionDate,
        displayOrder,
    } = req.body as unknown as IBatchSession;

    const valuesArray = {
        batchId,
        topicName,
        topicDescription,
        youtubeVideoId,
        durationInMinutes,
        sessionDate,
        displayOrder,
    };
    var updater: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(valuesArray as IBatchSession)) {
        if (value != undefined && value != "") {
            updater[key] = value;
        }
    }
    try {
        const batchSession = new BatchSession({
            _id: new mongoose.Types.ObjectId(),
            ...updater,
        });
        const result = await batchSession.save();
        console.info(result);
        return res.status(201).json({
            data: result,
            result: true,
            message: "Session added successfully.",
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
                    ? `${keys[idx]}:${values[idx]} already exists`
                    : "Unknown Error!";
        }

        return res.status(200).json({ result: false, message: message });
    }
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await BatchSession.find();
        return res
            .status(200)
            .json({ data: data, result: true, message: "Sessions found" });
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
        const data = await BatchSession.findById(id);
        return data
            ? res
                .status(201)
                .json({ data: data, result: true, message: "Session Found" })
            : res.status(200).json({ result: false, message: "Session not found" });
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
        topicName,
        topicDescription,
        youtubeVideoId,
        durationInMinutes,
        sessionDate,
        displayOrder,
    } = req.body as IBatchSession;

    const valuesArray = {
         batchId,
        topicName,
        topicDescription,
        youtubeVideoId,
        durationInMinutes,
        sessionDate,
        displayOrder,
    };

    var updater: { [key: string]: any } = {};

    for (const [key, value] of Object.entries(valuesArray as IBatchSession)) {
        if (value === true || value === false) {
            // for boolean specific values
            updater[key] = value;
        }
        if (value != undefined && value != "") {
            updater[key] = value;
        }
    }
    try {
        const updatedModel = await BatchSession.findByIdAndUpdate({ _id: id }, updater);
        return res
            .status(200)
            .json({ data: updatedModel, result: true, message: "Session updated." });
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
        const data = await BatchSession.findByIdAndDelete(id);
        return data
            ? res
                .status(200)
                .json({ data: data, result: true, message: "Session Deleted" })
            : res.status(200).json({ result: false, message: "Session not found" });
    } catch (error) {
        console.error(error);
        return res
            .status(200)
            .json({ data: error, result: false, message: "Something Went wrong!" });
    }
};

const getSessionByBatchId = async (req: Request, res: Response, next: NextFunction) => {
    const batchId = req.params.batchId;
    try {
        const data = await BatchSession.find({ batchId: batchId });
        return data.length > 0
            ? res.status(200).json({ data: data, result: true, message: "Sessions found" })
            : res.status(200).json({ result: false, message: "No sessions found for the given batch ID" });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ data: error, result: false, message: "Something went wrong" });
    }
};


export default { create, readAll, readOne, deleteOne, updateOne, getSessionByBatchId };