import express from "express";
import {
  ordersController,
  productsController,
  machinesController,
  operationsReportsController,
  ordersReportsController,
  accidentsReportsController,
  operationsController,
  operationsReportsControllerGet,
  ordersReportsControllerGet,
  accidentsReportsControllerGet,
  mttrController,
  mttfController,
  mtbfController,
  availabilityController,
  qualityController,
  performanceController,
} from "../controllers/api";

const apiRouter = express.Router();

apiRouter.get("/orders", ordersController);
apiRouter.get("/products", productsController);
apiRouter.get("/machines", machinesController);
apiRouter.get("/operations", operationsController);
apiRouter.get("/operations-reports", operationsReportsControllerGet);
apiRouter.get("/orders-reports", ordersReportsControllerGet);
apiRouter.get("/accidents-reports", accidentsReportsControllerGet);

apiRouter.get("/mttr", mttrController);
apiRouter.get("/mttf", mttfController);
apiRouter.get("/mtbf", mtbfController);

apiRouter.get("/availability", availabilityController);
apiRouter.get("/quality", qualityController);
apiRouter.get("/performance", performanceController);

apiRouter.post("/operations-reports", operationsReportsController);
apiRouter.post("/orders-reports", ordersReportsController);
apiRouter.post("/accidents-reports", accidentsReportsController);

export default apiRouter;
