import './express';

declare module 'express' {
  interface Request {
    user?: any;  // Add user property to Request
  }
}