import { Request, Response, NextFunction  } from 'express';
import { decodeJwt, verifyJwt } from '../helper';

type User = {
  user?: any;
}

export const AuthMiddleware = (req: Request & User, res: Response, next: NextFunction ) => {
  if (req.headers.authorization) {
    const token = (req.headers.authorization as string).split(' ')[1];
    if (verifyJwt(token)) {
      req.user = decodeJwt(token)!;
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  } else {
    res.status(500).json({ message: "Error on authorizing" });
  }
}