import express from "express";
import {
  ordersController,
  productsController,
  machinesController,
  operationsReportsController,
  ordersReportsController,
  accidentsReportsController,
  operationsController,
} from "../controllers/api";

const apiRouter = express.Router();

apiRouter.get("/orders", ordersController);
apiRouter.get("/products", productsController);
apiRouter.get("/machines", machinesController);
apiRouter.get("/operations", operationsController);

apiRouter.post("/operations-reports", operationsReportsController);
apiRouter.post("/orders-reports", ordersReportsController);
apiRouter.post("/accidents-reports", accidentsReportsController);

export default apiRouter;
