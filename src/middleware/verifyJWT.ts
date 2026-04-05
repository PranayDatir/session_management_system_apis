import config from '../config/config';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Users from '../models/Users';
import { IJwtLocals } from '../constants/interfaces';

const checkAuthWeb = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.headers.authorization?.split(' ')[1];

        // console.log(token)

        if (token) {
            jwt.verify(token, config.server.token.secret, async (error, decoded) => {
                if (error) {
                    return res.status(200).json({
                        result:false,
                        message: 'Unable decode token'
                    });
                } else {
                    const jwtLocal = decoded as IJwtLocals;
                    // console.log(jwtLocal)
                    res.locals.jwt = jwtLocal;
                    if (jwtLocal.exp - jwtLocal.iat > 0) {
                        try {
                            const user = await Users.findById(jwtLocal._id);
                            if (!!user) {
                                // console.log(user);
                                res.locals.loggedUser = user.toObject();
                                next();
                            } else {
                                return res.status(200).json({
                                    result: false,
                                    message: 'Login Failed'
                                });
                            }
                        } catch (error) {
                            console.error(error);
                            return res.status(200).json({
                                result: false,
                                message: 'Login Failed'
                            });
                        }
                    } else {
                        return res.status(200).json({
                            result: false,
                            message: 'Login Failed | Token Expired'
                        });
                    }
                }
            });
        } else {
            return res.status(200).json({
                error: true,
                message: 'Login Failed | Token Not Found'
            });
        }
    } catch (error) {
        console.error(error)
    }
};


export default { checkAuthWeb };
