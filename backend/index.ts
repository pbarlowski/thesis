import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import sql from "mssql";

import authRouter from "./src/routes/auth";
import apiRouter from "./src/routes/api";

import { authVerification } from "./src/middlewares/authVerification";

dotenv.config();
const app = express();

const config = {
  user: "SA",
  password: "<YourStrong@Passw0rd>",
  server: "127.0.0.1",
  database: "script",
  options: {
    trustedconnection: true,
    enableArithAbort: true,
    trustServerCertificate: true,
    instancename: "",
  },
  port: 1433,
};

// Middlewares
app.use(cors());
app.options("*", cors());
app.use(cookieParser());
app.use(express.json());
// app.use("/api", authVerification);

// Routes
app.use("/auth", authRouter);
app.use("/api", apiRouter);

app.listen(process.env.PORT, async () => {
  await sql.connect(config);
  console.log(`Example app listening on port ${process.env.PORT}`);
});
