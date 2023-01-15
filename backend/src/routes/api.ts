import express from "express";
import {
  ordersController,
  productsController,
  machinesController,
} from "../controllers/api";

const apiRouter = express.Router();

apiRouter.get("/orders", ordersController);
apiRouter.get("/products", productsController);
apiRouter.get("/machines", machinesController);

export default apiRouter;
