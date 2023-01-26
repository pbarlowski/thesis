import { Request, Response } from "express";
import moment from "moment";
import sql from "mssql";

export const ordersController = async (req: Request, res: Response) => {
  const result =
    await sql.query`select orders.id_orders, orders.order_name, orders.order_amount, orders.order_status, products.product_id, products.product_type, orders_reports.id_orders_reports from orders inner join products on orders.fk_products=products.id_products FULL OUTER JOIN orders_reports on orders.id_orders=orders_reports.fk_orders;`;

  console.log(result);

  res.json({ data: result.recordset });
};

export const productsController = async (req: Request, res: Response) => {
  const result = await sql.query`select * from products;`;

  console.log(result);

  res.json({ data: result.recordset });
};

export const machinesController = async (req: Request, res: Response) => {
  const result =
    await sql.query`select * from machines order by machine_id asc;`;

  console.log(result);

  res.json({ data: result.recordset });
};

export const operationsController = async (req: Request, res: Response) => {
  const result =
    await sql.query`select operations.id_operations, operations.operation_symbol, machines.id_machines, machines.machine_id, machines.machine_type, schedules.planed_start, schedules.planed_end, schedules.schedule_status, orders.order_name from operations inner join machines on operations.fk_machines=machines.id_machines inner join schedules on schedules.fk_operations=operations.id_operations inner join orders on schedules.fk_orders=orders.id_orders;`;

  console.log(result);

  res.json({ data: result.recordset });
};

export const operationsReportsControllerGet = async (
  req: Request,
  res: Response
) => {
  const result = await sql.query`select * from operations_reports;`;

  console.log(result);

  res.json({ data: result.recordset });
};

export const ordersReportsControllerGet = async (
  req: Request,
  res: Response
) => {
  const result = await sql.query`select * from orders_reports;`;

  console.log(result);

  res.json({ data: result.recordset });
};

export const accidentsReportsControllerGet = async (
  req: Request,
  res: Response
) => {
  const result = await sql.query`select * from accidents_reports;`;

  console.log(result);

  res.json({ data: result.recordset });
};

// Controllers Insert
export const operationsReportsController = async (
  req: Request,
  res: Response
) => {
  const { body } = req;

  if (!body["id_operations"] || !body["real_start"] || !body["real_end"])
    return res.sendStatus(400);

  await sql.query`insert into operations_reports (fk_operations, real_start, real_end) values (${
    body["id_operations"]
  },${new Date(parseInt(body["real_start"], 10))},${new Date(
    parseInt(body["real_end"], 10)
  )})`;

  await sql.query`update schedules set schedule_status='done' where fk_operations=${body["id_operations"]}`;

  const result =
    await sql.query`select fk_orders from schedules where fk_operations=${body["id_operations"]}`;

  const schedulesResult =
    await sql.query`select schedule_status from schedules where fk_orders=${result.recordset[0]["fk_orders"]}`;

  let numberOfSchedulesDone = 0;

  console.log(schedulesResult.recordset);

  schedulesResult.recordset.forEach((schedule) => {
    if (schedule["schedule_status"] === "done") numberOfSchedulesDone++;
  });

  if (numberOfSchedulesDone === 5)
    await sql.query`update orders set order_status='done' where id_orders=${result.recordset[0]["fk_orders"]}`;

  res.sendStatus(200);
};

export const ordersReportsController = async (req: Request, res: Response) => {
  const { body } = req;

  if (
    body["id_orders"] === undefined ||
    body["products_valid"] === undefined ||
    body["products_eligible"] === undefined
  )
    return res.sendStatus(400);

  await sql.query`insert into orders_reports (fk_orders, products_valid, products_eligible) values (${body["id_orders"]},${body["products_valid"]},${body["products_eligible"]})`;

  await res.sendStatus(200);
};

export const accidentsReportsController = async (
  req: Request,
  res: Response
) => {
  const { body } = req;
  console.log(body);

  if (
    !body["id_operations"] ||
    !body["accident_type"] ||
    !body["accident_start"] ||
    !body["accident_end"]
  )
    return res.sendStatus(400);

  await sql.query`insert into accidents_reports (fk_operations, accident_type,accident_start, accident_end) values (${
    body["id_operations"]
  },${body["accident_type"]},${new Date(
    parseInt(body["accident_start"], 10)
  )},${new Date(parseInt(body["accident_end"], 10))})`;

  res.sendStatus(200);
};

// Metrics

export const mttrController = async (req: Request, res: Response) => {
  let totalTime = 0;
  let totalAccidents = 0;
  let mttr = 0;

  const { machine } = req.query;

  if (!machine) return res.sendStatus(400);

  const result =
    await sql.query`select accidents_reports.accident_start, accidents_reports.accident_end from schedules inner join operations on schedules.fk_operations=operations.id_operations inner join accidents_reports on operations.id_operations=accidents_reports.fk_operations inner join orders on orders.id_orders=schedules.fk_orders where orders.order_status='done' and operations.fk_machines=${machine}`;

  result.recordset.forEach((accident) => {
    totalTime +=
      moment(accident["accident_end"]).unix() -
      moment(accident["accident_start"]).unix();
    totalAccidents++;
  });

  if (totalAccidents > 0) mttr = totalTime / totalAccidents / 60;

  res.json({ data: mttr });
};

export const mttfController = async (req: Request, res: Response) => {
  let mttf = 0;
  let totalAccidentTime = 0;
  let totalAccidents = 0;

  let totalRealTime = 0;

  const { machine } = req.query;

  if (!machine) return res.sendStatus(400);

  const accidentsResult =
    await sql.query`select accidents_reports.accident_start, accidents_reports.accident_end from schedules inner join operations on schedules.fk_operations=operations.id_operations inner join accidents_reports on operations.id_operations=accidents_reports.fk_operations inner join orders on orders.id_orders=schedules.fk_orders where orders.order_status='done' and operations.fk_machines=${machine}`;

  const ordersResult =
    await sql.query`select operations_reports.real_start, operations_reports.real_end from orders inner join schedules on orders.id_orders=schedules.fk_orders inner join operations on schedules.fk_operations=operations.id_operations inner join operations_reports on operations.id_operations=operations_reports.fk_operations where orders.order_status='done' and operations.fk_machines=${machine}`;

  accidentsResult.recordset.forEach((accident) => {
    totalAccidentTime +=
      moment(accident["accident_end"]).unix() -
      moment(accident["accident_start"]).unix();
    totalAccidents++;
  });

  ordersResult.recordset.forEach((order) => {
    totalRealTime +=
      moment(order["real_end"]).unix() - moment(order["real_start"]).unix();
  });

  if (totalAccidents > 0)
    mttf = (totalRealTime - totalAccidentTime) / totalAccidents / 60;

  res.json({ data: mttf });
};

export const mtbfController = async (req: Request, res: Response) => {
  let mttf = 0;
  let totalAccidentTime = 0;
  let totalAccidents = 0;

  let totalRealTime = 0;

  const { machine } = req.query;

  if (!machine) return res.sendStatus(400);

  const accidentsResult =
    await sql.query`select accidents_reports.accident_start, accidents_reports.accident_end from schedules inner join operations on schedules.fk_operations=operations.id_operations inner join accidents_reports on operations.id_operations=accidents_reports.fk_operations inner join orders on orders.id_orders=schedules.fk_orders where orders.order_status='done' and operations.fk_machines=${machine}`;

  const ordersResult =
    await sql.query`select operations_reports.real_start, operations_reports.real_end from orders inner join schedules on orders.id_orders=schedules.fk_orders inner join operations on schedules.fk_operations=operations.id_operations inner join operations_reports on operations.id_operations=operations_reports.fk_operations where orders.order_status='done' and operations.fk_machines=${machine}`;

  accidentsResult.recordset.forEach((accident) => {
    totalAccidentTime +=
      moment(accident["accident_end"]).unix() -
      moment(accident["accident_start"]).unix();
    totalAccidents++;
  });

  ordersResult.recordset.forEach((order) => {
    totalRealTime +=
      moment(order["real_end"]).unix() - moment(order["real_start"]).unix();
  });

  if (totalAccidents > 0)
    mttf = (totalRealTime - totalAccidentTime) / totalAccidents / 60;

  let totalTime = 0;
  let totalAccidents2 = 0;
  let mttr = 0;

  const result =
    await sql.query`select accidents_reports.accident_start, accidents_reports.accident_end from schedules inner join operations on schedules.fk_operations=operations.id_operations inner join accidents_reports on operations.id_operations=accidents_reports.fk_operations inner join orders on orders.id_orders=schedules.fk_orders where orders.order_status='done'`;

  result.recordset.forEach((accident) => {
    totalTime +=
      moment(accident["accident_end"]).unix() -
      moment(accident["accident_start"]).unix();
    totalAccidents2++;
  });

  if (totalAccidents > 0) mttr = totalTime / totalAccidents / 60;

  const mtbf = mttf + mttr;

  res.json({ data: mtbf });
};

export const availabilityController = async (req: Request, res: Response) => {
  const { machine } = req.query;

  if (!machine) return res.sendStatus(400);

  let realTime = 0;
  let accidentsTime = 0;

  const data =
    await sql.query`select * from orders inner join schedules on schedules.fk_orders=orders.id_orders inner join operations on schedules.fk_operations=operations.id_operations inner join operations_reports on operations_reports.fk_operations=operations.id_operations where orders.order_status='done' and operations.fk_machines=${machine}`;

  const resultAccidents =
    await sql.query`select accidents_reports.accident_start, accidents_reports.accident_end from schedules inner join operations on schedules.fk_operations=operations.id_operations inner join accidents_reports on operations.id_operations=accidents_reports.fk_operations inner join orders on orders.id_orders=schedules.fk_orders where orders.order_status='done' and operations.fk_machines=${machine}`;

  data.recordset.forEach((time) => {
    realTime +=
      moment(time["real_end"]).unix() - moment(time["real_start"]).unix();
  });

  resultAccidents.recordset.forEach((time) => {
    accidentsTime +=
      moment(time["accident_end"]).unix() -
      moment(time["accident_start"]).unix();
  });

  const availability = (realTime - accidentsTime) / realTime;

  res.json({ data: availability });
};

export const qualityController = async (req: Request, res: Response) => {
  const { machine } = req.query;

  if (!machine) return res.sendStatus(400);

  let total = 0;
  let good = 0;

  const result =
    await sql.query`select orders_reports.products_valid, orders_reports.products_eligible from schedules inner join operations on schedules.fk_operations=operations.id_operations inner join orders on schedules.fk_orders=orders.id_orders inner join orders_reports on orders.id_orders=orders_reports.fk_orders where orders.order_status='done' and operations.fk_machines=${machine}`;

  result.recordset.forEach((order) => {
    total += order["products_valid"] + order["products_eligible"];
    good += order["products_valid"];
  });

  const quality = good / total;

  res.json({ data: quality });
};

export const performanceController = async (req: Request, res: Response) => {
  const { machine } = req.query;

  if (!machine) return res.sendStatus(400);

  let realTime = 0;
  let accidentsTime = 0;
  let processingTime = 0;

  const resultAccidents =
    await sql.query`select accidents_reports.accident_start, accidents_reports.accident_end from schedules inner join operations on schedules.fk_operations=operations.id_operations inner join accidents_reports on operations.id_operations=accidents_reports.fk_operations inner join orders on orders.id_orders=schedules.fk_orders where orders.order_status='done' and operations.fk_machines=${machine}`;

  const data =
    await sql.query`select * from orders inner join schedules on schedules.fk_orders=orders.id_orders inner join operations on schedules.fk_operations=operations.id_operations inner join operations_reports on operations_reports.fk_operations=operations.id_operations where orders.order_status='done' and operations.fk_machines=${machine}`;

  data.recordset.forEach((time) => {
    realTime +=
      moment(time["real_end"]).unix() - moment(time["real_start"]).unix();
  });

  resultAccidents.recordset.forEach((time) => {
    accidentsTime +=
      moment(time["accident_end"]).unix() -
      moment(time["accident_start"]).unix();
  });

  data.recordset.forEach((item) => {
    processingTime += item["order_amount"] * item["time_per_unit"] * 60;
  });

  console.log(data);

  const performance = processingTime / (realTime - accidentsTime);

  res.json({ data: performance });
};
