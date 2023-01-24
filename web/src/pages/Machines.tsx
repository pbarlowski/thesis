import React, { useState, useEffect } from "react";

import Table from "../components/Table";

const Machines = () => {
  const [rows, setRows] = useState([]);

  const columns = [
    { key: "number_number", name: "Number", width: "max-content" },
    { key: "machine_id_string", name: "Machine ID" },
    { key: "machine_type_string", name: "Machine type" },
  ];

  useEffect(() => {
    (async () => {
      const result = await fetch("http://127.0.0.1:3001/api/machines", {
        mode: "cors",
      });
      const { data } = await result.json();

      const rows = data.map((row: any, index: number) => ({
        number_number: index + 1,
        machine_id_string: row["machine_id"],
        machine_type_string: row["machine_type"],
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

export default Machines;
