import { Request } from 'express';
import { IJWTPayload } from './jwt-payload.unterface';
export interface UserRequestI extends Request {
  user: IJWTPayload;
}
