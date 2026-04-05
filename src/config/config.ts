import * as dotenv from "dotenv";

dotenv.config();

const MONGO_USERNAME = process.env?.['MONGO_USERNAME'] || "pranaydatir510";
const MONGO_PASSWORD = process.env?.['MONGO_PASSWORD'] || "pranaydatir510";

const MONGODB_HOST = process.env?.['MONGODB_HOST'] || "cluster0.aggg2ss.mongodb.net/";
const MONGODB_PORT = process.env?.['MONGODB_PORT'] || "27017";

const SERVER_TOKEN_ISSUER =
  process.env?.['SERVER_TOKEN_ISSUER'] || "SESSION MANAGEMENT SYSTEM";

const MONGODB_DB_NAME = process.env?.['SESSION_MANAGEMENT_SYSTEM_DB_NAME'] || "session_management_system";

const SERVER_TOKEN_SECRET =
  process.env?.['SERVER_TOKEN_SECRET'] || "RIYA_TRAVELS_CRM";
const SERVER_TOKEN_EXPIRETIME = process.env?.['SERVER_TOKEN_EXPIRETIME'] || "7d";

// const MONGO_URL = `mongodb+srv://${MONGODB_HOST}:${MONGODB_PORT}`;
// const MONGO_URL = `mongodb+srv://pranaydatir510:pranaydatir510@cluster0.aggg2ss.mongodb.net/?appName=Cluster0`;
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGODB_HOST}${MONGODB_DB_NAME}?appName=Cluster0`;


const SERVER_PORT = 9098;

const SMTP_HOST =
  process.env?.['RIYA_TRAVELS_CRM_SMTP_HOST'] || "email-smtp.ap-south-1.amazonaws.com";
const SMTP_PORT = process.env?.['RIYA_TRAVELS_CRM_SMTP_PORT'] || 587;
const SMTP_SECURE = process.env?.['RIYA_TRAVELS_CRM_NODE_ENV'] || "debug";
const SMTP_USERNAME =
  process.env?.['RIYA_TRAVELS_CRM_SMTP_USERNAME'] || "AKIAY7WCMD5CP6LZ2GF6";
const SMTP_PASSWORD =
  process.env?.['RIYA_TRAVELS_CRM_SMTP_PASSWORD'] ||
  "BBal65VLY1zV66vUpE81I266cKaJS7WL0az/HmzNxnoE";
const SMTP_FROM_EMAIL =
  process.env?.['RIYA_TRAVELS_CRM_SMTP_PASSWORD'] || "no-reply@cosmicagps.com";

const NODE_ENV =
  process.env?.['NODE_ENV'] || "development";

const OTP_EXPIRATION_TIME = process.env.OTP_EXPIRATION_TIME || 300;
const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || 10;
const config = {
  nodeEnv: NODE_ENV,
  otpExpirationTime: OTP_EXPIRATION_TIME,
  bcryptSaltRound: +(BCRYPT_SALT_ROUNDS),
  tcpServer: {
    port: 44018
  },
  mongo: {
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    url: MONGO_URL,
    dbName: MONGODB_DB_NAME,
  },
  server: {
    // port: SERVER_PORT,
    token: {
      expireTime: SERVER_TOKEN_EXPIRETIME,
      issuer: SERVER_TOKEN_ISSUER,
      secret: SERVER_TOKEN_SECRET,
    },
  },
  mail: {
    HOST: SMTP_HOST,
    PORT: SMTP_PORT,
    SECURE: SMTP_SECURE,
    USERNAME: SMTP_USERNAME,
    PASSWORD: SMTP_PASSWORD,
    FROMMAIL: SMTP_FROM_EMAIL,
  },
};


export default config;