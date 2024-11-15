
// declare global {
//     namespace Express {
//       interface Request {
//         user?: {
//           uid: string;
//           [key: string]: any;
//         };
//       }
//     }
//   }

// src/@types/express/index.d.ts

// src/@types/express/index.d.ts

import * as express from 'express';
import * as multer from 'multer';

export {}; // This ensures the file is treated as a module

declare global {
  namespace Express {
    interface Request {
      user?: {
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
        profilePictureSettings?: any;
        [key: string]: any;
      };
      file?: multer.File;
      files?: multer.File[] | { [fieldname: string]: multer.File[] };
    }
  }
}