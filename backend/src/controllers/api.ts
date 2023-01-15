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
