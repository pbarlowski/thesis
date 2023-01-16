import { Request, Response } from "express";
import sql from "mssql";

export const ordersController = async (req: Request, res: Response) => {
  const result =
    await sql.query`select orders.id_orders, orders.order_amount, orders.status, products.product_id, products.product_type from orders inner join products on orders.fk_products=products.id_products inner join schedules on schedules.fk_orders=orders.id_orders inner join operations on schedules.fk_operations=operations.id_operations;`;

  console.log(result);

  res.json({ data: result.recordset });
};

export const productsController = async (req: Request, res: Response) => {
  const result = await sql.query`select * from products;`;

  console.log(result);

  res.json({ data: result.recordset });
};

export const machinesController = async (req: Request, res: Response) => {
  const result = await sql.query`select * from machines;`;

  console.log(result);

  res.json({ data: result.recordset });
};

export const operationsController = async (req: Request, res: Response) => {
  const result =
    await sql.query`select operations.id_operations, operations.operation_symbol, machines.id_machines, machines.machine_id, machines.machine_type from operations inner join machines on operations.fk_machines=machines.id_machines;`;

  console.log(result);

  res.json({ data: result.recordset });
};

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

  res.sendStatus(200);
};

export const ordersReportsController = async (req: Request, res: Response) => {
  const { body } = req;

  if (
    !body["id_orders"] ||
    !body["products_valid"] ||
    !body["products_eligible"]
  )
    return res.sendStatus(400);

  await sql.query`insert into orders_reports (fk_orders, products_valid, products_eligible) values (${body["id_orders"]},${body["products_valid"]},${body["products_eligible"]})`;

  res.sendStatus(200);
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
