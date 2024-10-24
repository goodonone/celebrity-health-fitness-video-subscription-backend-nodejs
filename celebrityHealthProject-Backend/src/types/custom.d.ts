import { Request } from 'express';

export interface UserData {
  userId: string;
}

export interface RequestWithUser extends Request {
  user?: UserData;
}