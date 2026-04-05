import mongoose from "mongoose";


/** Connect to Mongo */
import config from "./config/config";
import { Helpers } from "./HelperFunctions/helper";
import Users from "./models/Users";
console.info(`Connecting to => ${config.mongo.url}`);
console.info(config.mongo);
mongoose
    .connect(config.mongo.url, {
        dbName: config.mongo.dbName,
        user: config.mongo.username,
        pass: config.mongo.password,
        // authSource: MONGODB_DBNAME,
        retryWrites: true,
        w: "majority",
    })
    .then(() => {
        console.info("Mongo connected successfully.");
        seedServer();
    })
    .catch((error) => console.error(error));

/** Only Seed Server if Mongoose Connects */
const seedServer = async () => {

    const password = "Password123";

    const createUser = new Users({
        _id: new mongoose.Types.ObjectId(),
        fullName: "Pranay Datir",
        email: "pranaydatir510@gmail.com",
        mobileNumber: "9158956020",
        password: "",
        role: "Super Admin",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    const hashedPass = await Helpers.bcryptHash(password, 10);
    if (hashedPass) {
        createUser.password = hashedPass;

        const userResult = await createUser.save();
        console.info(userResult);
    } else {
        console.info(`Hash Error BCRYPTJS`);
    }
};
