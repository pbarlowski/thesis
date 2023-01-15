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
const Products = () => {
  const [data, setData] = useState();

  useEffect(() => {
    (async () => {
      const json = await fetch("http://127.0.0.1:3001/api/products", {
        mode: "cors",
      });
      const { data } = await json.json();

      const rows = data.map((row: any) => ({
        product_id_string: row["product_id"],
        product_type_string: row["product_type"],
      }));

      const dataToSet = {
        rows,
        columns: [
          { key: "product_id_string", name: "Product ID" },
          { key: "product_type_string", name: "Product type" },
        ],
      };

      console.log(dataToSet);
      // @ts-ignore
      setData(dataToSet);
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
      {data ? <Table data={data} /> : null}
    </>
  );
};

export default Products;
