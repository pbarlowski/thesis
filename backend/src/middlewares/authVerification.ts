import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authVerification = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("cookies", req.cookies);
  const { token } = req.cookies;

  if (!token) return res.sendStatus(401);

  try {
    res.locals.token = jwt.verify(token, "secret");
    return next();
  } catch (e) {
    console.log("decode error", e);
    return res.sendStatus(401);
  }
};
