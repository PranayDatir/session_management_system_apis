import { NextFunction, Request, Response } from 'express';
import Users, { IUser } from '../models/Users';
import mongoose from 'mongoose';

const create = async (req: Request, res: Response, next: NextFunction) => {
    const {
        fullName,
        email,
        mobileNumber,
        password,
        role,
        isActive,
    } = req.body as unknown as IUser;

    const valuesArray = {
        fullName,
        email,
        mobileNumber,
        password,
        role,
        isActive,
    };
    var updater: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(valuesArray as IUser)) {
        if (value != undefined && value != "") {
            updater[key] = value;
        }
    }
    try {
        const User = new Users({
            _id: new mongoose.Types.ObjectId(),
            ...updater,
        });
        const result = await User.save();
        console.info(result);
        return res.status(201).json({
            data: result,
            result: true,
            message: "User added successfully.",
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
        const data = await Users.find();
        return res
            .status(200)
            .json({ data: data, result: true, message: "Users found" });
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
        const data = await Users.findById(id);
        return data
            ? res
                .status(201)
                .json({ data: data, result: true, message: "User Found" })
            : res.status(200).json({ result: false, message: "User not found" });
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
         fullName,
        email,
        mobileNumber,
        password,
        role,
        isActive,
    } = req.body as IUser;

    const valuesArray = {
         fullName,
        email,
        mobileNumber,
        password,
        role,
        isActive,
    };

    var updater: { [key: string]: any } = {};

    for (const [key, value] of Object.entries(valuesArray as IUser)) {
        if (value === true || value === false) {
            // for boolean specific values
            updater[key] = value;
        }
        if (value != undefined && value != "") {
            updater[key] = value;
        }
    }
    try {
        const updatedModel = await Users.findByIdAndUpdate({ _id: id }, updater);
        return res
            .status(200)
            .json({ data: updatedModel, result: true, message: "Users updated." });
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
        const data = await Users.findByIdAndDelete(id);
        return data
            ? res
                .status(200)
                .json({ data: data, result: true, message: "Users Deleted" })
            : res.status(200).json({ result: false, message: "Users not found" });
    } catch (error) {
        console.error(error);
        return res
            .status(200)
            .json({ data: error, result: false, message: "Something Went wrong!" });
    }
};

export default { create, readAll, readOne, deleteOne, updateOne };