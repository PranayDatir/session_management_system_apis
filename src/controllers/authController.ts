import { NextFunction, Request, Response } from 'express';
import { Helpers } from '../HelperFunctions/helper';
import Users, { IUser } from '../models/Users';

const signJwtAsync = (payload: Record<string, unknown>): Promise<string> =>
  new Promise((resolve, reject) => {
    Helpers.signJWT(payload, (error, token) => {
      if (error || !token) {
        reject(error ?? new Error('Token generation failed.'));
        return;
      }

      resolve(token);
    });
  });

const isPasswordMatched = async (
  inputPassword: string,
  savedPassword?: string
): Promise<boolean> => {
  if (!savedPassword) {
    return false;
  }

  if (savedPassword === inputPassword) {
    return true;
  }

  try {
    return await Helpers.compareNumericValueWithHash(inputPassword, savedPassword);
  } catch (error) {
    console.error('Password comparison failed:', error);
    return false;
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password?.trim();

    if (!email || !password) {
      return res.status(200).json({
        result: false,
        message: 'Email and password are required.',
      });
    }

    const user = (await Users.findOne({ email })) as IUser | null;

    if (!user) {
      return res.status(200).json({
        result: false,
        message: 'Invalid email or password.',
      });
    }

    if (user.isActive === false) {
      return res.status(200).json({
        result: false,
        message: 'Your account is inactive.',
      });
    }

    const isValidPassword = await isPasswordMatched(password, user.password);

    if (!isValidPassword) {
      return res.status(200).json({
        result: false,
        message: 'Invalid email or password.',
      });
    }

    const userData = user.toObject();
    const token = await signJwtAsync({
      _id: user._id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      result: true,
      message: 'Login successful',
      data: userData,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: 'Internal server error',
      error,
    });
  }
};

// const refreshUser = async (req: Request, res: Response, next: NextFunction) => {

//     const user = res.locals.loggedUser as IUser;

//     if (user.isDisabled) {
//         return res.status(200).json({ error: true, message: 'Your account is disabled.' });
//     }
//     else {
//         Helpers.signJWT(user, (refreshUserError, token) => {
//             if (!!refreshUserError) {
//                 return res.status(200).json({ error: true, message: `Token Signin Failed! ${user.id}` });
//             } else if (token) {
//                 const authUser = { ...user, otp: null, password: null };
//                 return res.status(200).json({
//                     error: false,
//                     message: 'Signin Successful',
//                     user: {
//                         ...authUser,
//                     },
//                     token,
//                     expires_in_sec: 36000
//                 });
//             }
//         })
//     }
// };

// const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const email = req.body.email.trim().toLowerCase();

//         if (!email) {
//             return res.status(200).json({ data: null, error: true, message: 'Email is required.' });
//         }

//         const user = await User.findOne({ email }) as IUser;

//         if (!user) {
//             return res.status(200).json({ data: null, error: true, message: 'Invalid Email.' });
//         }

//         const otp = Helpers.generateOTP()
//         console.log('Email : Password Reset OTP : ', otp);

//         const expiryTime = +(config.otpExpirationTime || 60) * 1000;

//         const hasedOtp = await Helpers.bcryptHash(otp);
//         // const hasedOtp = await hashNumericValue(otp);
//         const otpExpiry = new Date(new Date().getTime() + expiryTime);

//         await User.findByIdAndUpdate({ _id: user._id }, {
//             otp: hasedOtp,
//             otpExpiry
//         }, { new: true });

//         const emailService = new EmailService();

//         const htmlTemplate =
//             `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Your OTP Code</title>
//         </head>
//         <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333; margin: 0; padding: 0;">
//             <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
//                 <div style="text-align: center; padding: 10px 0;">
//                     <img src="https://track.cosmicagps.com/assets/dark-logo.png" alt="Company Logo" style="width: 150px; height: auto;" />
//                 </div>
//                 <div style="padding: 20px; text-align: center;">
//                     <p>Dear ${user.firstName} ${user.lastName},</p>
//                     <p>Your One-Time Password (OTP) is:</p>
//                     <div style="font-size: 24px; font-weight: bold; color: #ff5722; margin: 20px 0;">[${otp}]</div>
//                     <p>Please enter this code to proceed. This OTP is valid for the next ${expiryTime / (60 * 1000)} minutes.</p>
//                     <p>If you did not request this code, please ignore this email.</p>
//                 </div>
//                 <div style="text-align: center; padding: 10px 0; font-size: 12px; color: #999999;">
//                     <p>Thank you for using our service!</p>
//                     <p>&copy; 2024 Cosmica Telematics Pvt Ltd. All rights reserved.</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//         `

//         await emailService.sendEmail({ to: email, subject: 'Reset Password', html: htmlTemplate });

//         return res.status(200).json({ data: null, error: false, message: 'OTP sent to your email.' });
//     } catch (error) {
//         console.log(error);
//     }
// }

// const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
//     let { otp, email, password, confirmPassword } = req.body;

//     otp = otp.trim();
//     password = password.trim();
//     confirmPassword = confirmPassword.trim();

//     if (!otp || !email || !password || !confirmPassword || password.length < 8) {
//         return res.status(200).json({
//             data: null,
//             error: true,
//             message: 'otp, email, password, confirmPassword fields are required and password should be atleast 8 characters long.'
//         })
//     }

//     const user = await User.findOne({ email }) as IUser;

//     if (!user) {
//         return res.status(200).json({ data: null, error: true, message: 'Invalid Email.' });
//     }

//     if (
//         !user.otp ||
//         new Date().getTime() > user?.otpExpiry!.getTime() ||
//         !(await Helpers.compareNumericValueWithHash(otp, user.otp))
//     ) {
//         return res.status(200).json({
//             data: null,
//             error: true,
//             message: 'Invalid OTP.'
//         })
//     }

//     if (confirmPassword !== password) {
//         return res.status(200).json({
//             data: null,
//             error: true,
//             message: 'Password and Confirm Password do not match.'
//         })
//     }
//     const hashedPassword = await Helpers.bcryptHash(password) as string;

//     await User.findByIdAndUpdate({ _id: user._id }, {
//         password: hashedPassword,
//         otp: null,
//         otpExpiry: null
//     }, { new: true });

//     res.status(200).json({
//         data: null,
//         error: false,
//         message: 'Password reset successful.'
//     })
// }

export default {
  login,
};
