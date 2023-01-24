import React, { useState, useEffect } from "react";

import Table from "../components/Table";

const Products = () => {
  const [rows, setRows] = useState([]);

  const columns = [
    { key: "number_number", name: "Number", width: "max-content" },
    { key: "product_id_string", name: "Product ID" },
    { key: "product_type_string", name: "Product type" },
  ];

  useEffect(() => {
    (async () => {
      const result = await fetch("http://127.0.0.1:3001/api/products", {
        mode: "cors",
      });
      const { data } = await result.json();

      const rows = data.map((row: any, index: number) => ({
        number_number: index + 1,
        product_id_string: row["product_id"],
        product_type_string: row["product_type"],
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

export default Products;
