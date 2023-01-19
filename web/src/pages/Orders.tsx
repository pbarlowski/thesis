import React, { useState, useEffect } from "react";

import Table from "../components/Table";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

const Graph = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  flex: 1;
`;

const Orders = () => {
  const [rows, setRows] = useState([]);

  const columns = [
    { key: "number_number", name: "Number", width: "max-content" },
    { key: "id_orders_string", name: "Order ID" },
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
        id_orders_string: row["id_orders"],
        order_amount_number: row["order_amount"],
        product_id_string: row["product_id"],
        product_type_string: row["product_type"],
        order_status_string: row["status"],
      }));

      // @ts-ignore
      setRows(rows);
    })();
  }, []);

  return (
    <>
      <Container>
        <Graph color="#00000020" />
        <Graph color="#00000030" />
        <Graph color="#00000040" />
        <Graph color="#00000050" />
      </Container>
      <Table columns={columns} rows={rows} />
    </>
  );
};

export default Orders;
