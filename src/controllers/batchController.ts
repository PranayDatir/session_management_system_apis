import { NextFunction, Request, Response } from 'express';
import mongoose from "mongoose";
import { Batch, IBatch } from '../models/Batches';

const create = async (req: Request, res: Response, next: NextFunction) => {
    const {
        batchName,
        description,
        startDate,
        endDate,
        isActive,
    } = req.body as unknown as IBatch;

    const valuesArray = {
        batchName,
        description,
        startDate,
        endDate,
        isActive,
    };
    var updater: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(valuesArray as IBatch)) {
        if (value != undefined && value != "") {
            updater[key] = value;
        }
    }
    try {
        const batch = new Batch({
            _id: new mongoose.Types.ObjectId(),
            ...updater,
        });
        const result = await batch.save();
        console.info(result);
        return res.status(201).json({
            data: result,
            result: true,
            message: "Batch added successfully.",
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
        const data = await Batch.find();
        return res
            .status(200)
            .json({ data: data, result: true, message: "Batches found" });
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
        const data = await Batch.findById(id);
        return data
            ? res
                .status(201)
                .json({ data: data, result: true, message: "Batch Found" })
            : res.status(200).json({ result: false, message: "Batch not found" });
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
       batchName,
        description,
        startDate,
        endDate,
        isActive,
    } = req.body as IBatch;

    const valuesArray = {
        batchName,
        description,
        startDate,
        endDate,
        isActive,
    };

    var updater: { [key: string]: any } = {};

    for (const [key, value] of Object.entries(valuesArray as IBatch)) {
        if (value === true || value === false) {
            // for boolean specific values
            updater[key] = value;
        }
        if (value != undefined && value != "") {
            updater[key] = value;
        }
    }
    try {
        const updatedModel = await Batch.findByIdAndUpdate({ _id: id }, updater);
        return res
            .status(200)
            .json({ data: updatedModel, result: true, message: "Batch updated." });
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
        const data = await Batch.findByIdAndDelete(id);
        return data
            ? res
                .status(200)
                .json({ data: data, result: true, message: "Batch Deleted" })
            : res.status(200).json({ result: false, message: "Batch not found" });
    } catch (error) {
        console.error(error);
        return res
            .status(200)
            .json({ data: error, result: false, message: "Something Went wrong!" });
    }
};

export default { create, readAll, readOne, deleteOne, updateOne };
