import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import Users from "../services/Users";

export const loginController = (req: Request, res: Response) => {
  const { login, password } = req.body;

  if (typeof login !== "string" || typeof password !== "string")
    return res.sendStatus(400);

  if (!Users.getInstance().checkForUser({ login, password }))
    return res.sendStatus(400);

  console.log(login, password);

  const token = jwt.sign(
    {
      login: login,
    },
    "secret",
    { expiresIn: "1h" }
  );

  res.cookie("token", token);

  res.sendStatus(200);
};

export const registerController = (req: Request, res: Response) => {
  const { login, password } = req.body;

  if (typeof login !== "string" || typeof password !== "string")
    return res.sendStatus(400);

  console.log(login, password);

  const token = jwt.sign(
    {
      login: login,
    },
    "secret",
    { expiresIn: "1h" }
  );

  res.cookie("token", token);

  Users.getInstance().addUser({ login, password });

  res.sendStatus(200);
};
