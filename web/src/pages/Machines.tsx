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
const Machines = () => {
  const [data, setData] = useState();

  useEffect(() => {
    (async () => {
      const json = await fetch("http://127.0.0.1:3001/api/machines", {
        mode: "cors",
      });
      const { data } = await json.json();

      const rows = data.map((row: any) => ({
        machine_id_string: row["machine_id"],
        machine_type_string: row["machine_type"],
      }));

      const dataToSet = {
        rows,
        columns: [
          { key: "machine_id_string", name: "Machine ID" },
          { key: "machine_type_string", name: "Machine type" },
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

export default Machines;
