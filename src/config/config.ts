import * as dotenv from "dotenv";

dotenv.config();

const MONGO_USERNAME = process.env?.['MONGO_USERNAME'] || "pranaydatir";
const MONGO_PASSWORD = process.env?.['MONGO_PASSWORD'] || "pranaydatir";

const MONGODB_HOST = process.env?.['MONGODB_HOST'] || "localhost/";
const MONGODB_PORT = process.env?.['MONGODB_PORT'] || "27017";

const SERVER_TOKEN_ISSUER =
  process.env?.['SERVER_TOKEN_ISSUER'] || "SESSION MANAGEMENT SYSTEM";

const MONGODB_DB_NAME = process.env?.['SESSION_MANAGEMENT_SYSTEM_DB_NAME'] || "session_management_system";

const SERVER_TOKEN_SECRET =
process.env?.['SERVER_TOKEN_SECRET'] || "SESSION_MANAGEMENT_SYSTEM_SECRET_KEY";
const SERVER_TOKEN_EXPIRETIME = process.env?.['SERVER_TOKEN_EXPIRETIME'] || "7d";

const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGODB_HOST}${MONGODB_DB_NAME}?appName=Cluster0`;


const SERVER_PORT = process.env?.['PORT'] || 9098;

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
    port: SERVER_PORT,
    token: {
      expireTime: SERVER_TOKEN_EXPIRETIME,
      issuer: SERVER_TOKEN_ISSUER,
      secret: SERVER_TOKEN_SECRET,
    },
  }
};


export default config;