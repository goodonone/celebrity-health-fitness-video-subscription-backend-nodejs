// import { Request } from 'express';

// export interface UserData {
//   userId: string;
// }

// export interface RequestWithUser extends Request {
//   user?: UserData;
// }


import { Request } from 'express';
import { User } from '../models/user';

export interface UserData {
    userId: string;
    email: string;
    isGoogleAuth: boolean;
    name: string;
    tier: string;
    firebaseUser?: {
        uid: string;
        email?: string | null;
    };
    weight?: string;
    height?: string;
    gender?: string;
    goals?: string;
    dateOfBirth?: string;
    imgUrl?: string;
    [key: string]: any;
}

export interface RequestWithUser extends Request {
    user?: UserData;
}