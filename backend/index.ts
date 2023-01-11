import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import sql from "mssql";

import authRouter from "./src/routes/auth";

import { authVerification } from "./src/middlewares/authVerification";

dotenv.config();
const app = express();

const config = {
  user: "user",
  password: "Qwer1234!",
  server: "127.0.0.1",
  database: "test",
  options: {
    trustedconnection: true,
    enableArithAbort: true,
    trustServerCertificate: true,
    instancename: "",
  },
  port: 1433,
};

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use("/api", authVerification);

// Routes
app.use("/auth", authRouter);
app.get("/api", async (req: Request, res: Response) => {
  console.log("token", res.locals.token);
  try {
    const result = await sql.query`SELECT * FROM testowedane`;
    console.log("result", result.recordset);
    res.sendStatus(200);
  } catch (e) {
    console.log("error", e);
    res.sendStatus(400);
  }
});

app.listen(process.env.PORT, async () => {
  await sql.connect(config);
  console.log(`Example app listening on port ${process.env.PORT}`);
});
