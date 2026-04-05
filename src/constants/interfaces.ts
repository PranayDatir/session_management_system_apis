import { IUser } from "../models/Users";

export type AuthType = "Email" | "Mobile" | "Password";
// export enum AuthType {
//   Email = 'email',
//   Mobile = 'mobile',
//   Password = 'password'
// }

export interface IOtpApiResponse {
  error: boolean;
  message: string;
}

export interface IApiResponse<T> {
  error: boolean;
  message: string;
  data: T;
}

export interface IJwtLocals {
  _id: string;
  iat: number;
  exp: number;
  iss: string;
}

export interface IPolygonLocation {
  type: string; //unique id
  coordinates?: number[][][];
}

export interface IPointLocation {
  type: string;
  coordinates: number[];
  radius?: number;
}

export interface IPagination<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IAuthApiResponse {
  error: boolean;
  message: string;
  user: IUser;
  token: string;
  expires_in_sec: number;
}

export interface IUpload {
  title?: string;
  dataType?: string;
}

export interface ILoginModel {
  email?: string;
  mobile?: string;
  auth_type: AuthType;
  otp?: number;
}

export interface Adapter<T> {
  adapt(item: any): T;
}

export interface IKeyValue<T> {
  [key: string]: T;
}
