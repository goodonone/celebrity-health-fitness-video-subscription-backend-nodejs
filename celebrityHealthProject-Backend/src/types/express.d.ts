import { User } from '../models/user';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        // other user properties you need
      };
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Your authentication logic
  req.user = { userId: 'someId' };
  next();
};