import * as express from 'express';

// declare namespace Express {
//     interface Request {
//         user?: {
//             userId: string;
//             email: string;
//             isGoogleAuth: boolean;
//             name: string;
//             tier: string;
//             firebaseUser?: {
//                 uid: string;
//                 email?: string | null;
//                 // Add other Firebase user properties you need
//             };
//             // Other user properties
//             weight?: string;
//             height?: string;
//             gender?: string;
//             goals?: string;
//             dateOfBirth?: string;
//             imgUrl?: string;
//             [key: string]: any;
//         };
//     }
// }

// src/types/express.d.ts

// import * as express from 'express';

// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         userId: string;
//         email: string;
//         isGoogleAuth: boolean;
//         name: string;
//         tier: string;
//         firebaseUser?: {
//           uid: string;
//           email?: string | null;
//         };
//         weight?: string;
//         height?: string;
//         gender?: string;
//         goals?: string;
//         dateOfBirth?: string;
//         imgUrl?: string;
//         [key: string]: any;
//       };
//       file?: Express.Multer.File;
//       files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
//     }
//   }
// }
// src/types/express.d.ts

// import * as express from 'express';

// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         userId: string;
//         email: string;
//         isGoogleAuth: boolean;
//         name: string;
//         tier: string;
//         firebaseUser?: {
//           uid: string;
//           email?: string | null;
//         };
//         weight?: string;
//         height?: string;
//         gender?: string;
//         goals?: string;
//         dateOfBirth?: string;
//         imgUrl?: string;
//         [key: string]: any;
//       };
//       file?: Express.Multer.File;
//       files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
//     }
//   }
// }

// src/types/express.d.ts

import * as express from 'express';

declare module 'express-serve-static-core' {
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
      [key: string]: any;
    };
    file?: Express.Multer.File;
    files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
  }
}