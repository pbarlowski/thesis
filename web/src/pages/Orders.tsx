import React, { useState, useEffect } from "react";

import Table from "../components/Table";

const Orders = () => {
  const [rows, setRows] = useState([]);

  const columns = [
    { key: "number_number", name: "Number", width: "max-content" },
    { key: "order_name_string", name: "Order Name" },
    { key: "order_amount_number", name: "Amount" },
    { key: "product_id_string", name: "Product ID" },
    { key: "product_type_string", name: "Product Type" },
    { key: "order_status_string", name: "Status" },
  ];

  useEffect(() => {
    (async () => {
      const result = await fetch("http://127.0.0.1:3001/api/orders", {
        mode: "cors",
      });
      const { data } = await result.json();

      const rows = data.map((row: any, index: number) => ({
        number_number: index + 1,
        order_name_string: row["order_name"],
        order_amount_number: row["order_amount"],
        product_id_string: row["product_id"],
        product_type_string: row["product_type"],
        order_status_string: row["order_status"],
      }));

      // @ts-ignore
      setRows(rows);
    })();
  }, []);

  return (
    <>
      <Table columns={columns} rows={rows} />
    </>
  );
};

export default Orders;
