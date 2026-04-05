import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import authRoutes from './Routes/authRoutes';
import config from './config/config';
import { ApiRoutes } from './constants/ApiRoutes';
import batchRoutes from './Routes/batchRoutes';
import userRoutes from './Routes/userRoutes';
import batchEnrollRoutes from './Routes/batchEnrollRoutes';
import sessionRoutes from './Routes/sessionRoutes';
import dashboardRoutes from './Routes/dashboardRoutes';

const router = express();

/** Connect to Mongo */
console.info(`Connecting to => ${config.mongo.url}`);
console.info(config.mongo);
mongoose
    .connect(config.mongo.url, {
        dbName: config.mongo.dbName,
        user: config.mongo.username,
        pass: config.mongo.password,
        retryWrites: true,
        w: 'majority'
    })
    .then(() => {
        console.info('Mongo connected successfully.');
        StartServer();
    })
    .catch((error) => console.error(error));

/** Only Start Server if Mongoose Connects */
const StartServer = () => {
    /** Log the request */
    router.use((req, res, next) => {
        
        /** Log the req */
        if (req.method != 'OPTIONS') {
            const inAt = new Date().toLocaleTimeString()
            const inUrl = req.url
            const ip = req?.headers?.['x-forwarded-for'] ?? req?.headers?.host
            
            res.on('finish', () => {
                /** Log the res */
                switch (res.statusCode) {
                    case 201:
                    case 200:
                        console.info(`[IN ${inAt}] [OUT ${new Date().toLocaleTimeString()}] [${req.method}] [${res.statusCode}] - IP: [${ip}] - [${inUrl}]`);
                        break;  
                    
                    default:
                        console.error(`[IN ${inAt}] [OUT ${new Date().toLocaleTimeString()}] [${req.method}] [${res.statusCode}] - IP: [${ip}] - [${inUrl}]`);
                        break;
                }
            });
        }

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    /** Rules of our API */
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });

    /** Basic Routes */
    router.use(ApiRoutes.api, authRoutes);
    router.use(ApiRoutes.batch, batchRoutes);
    router.use(ApiRoutes.candidate, userRoutes);
    router.use(ApiRoutes.batchEnrollment, batchEnrollRoutes);
    router.use(ApiRoutes.batchSessions, sessionRoutes);
    router.use(ApiRoutes.dashboard, dashboardRoutes);
    
    /** Healthcheck */
    router.get('/ping', (req, res, next) => res.status(200).json({ hello: 'world' }));
    router.get('/', (req, res, next) => res.send('<h1>Welcome to Session Management System</h1>'));

    /** Error handling */
    router.use((req, res, next) => {
        const error = new Error('Not found');

        console.error(error);

        return res.status(404).json({
            error:true,
            message: error.message
        });
    });

    http.createServer(router).listen(9098, () => console.info(`Server is running on port ${9098}`));
};


