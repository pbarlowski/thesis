import React, { useEffect, useState } from "react";

import Table from "../components/Table";
import styled from "styled-components";
import { Button, Modal, TextField, Stack } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const ModalContainer = styled.div`
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: #fff;
  border-radius: 24px;
  padding: 24px;
  flex-direction: column;
  align-items: center;
`;

const OrdersReports = () => {
  const [operationsRows, setOperationsRows] = useState([]);
  const [operationsReportsRows, setOperationsReportsRows] = useState([]);
  const [operationId, setOperationId] = useState();

  const [timeStart, setTimeStart] = useState(null);
  const [timeEnd, setTimeEnd] = useState(null);

  const operationsColumns = [
    { key: "number_number", name: "Number", width: "max-content" },
    { key: "id_operation_string", name: "Operation ID" },
    { key: "operation_symbol", name: "Operation Symbol" },
    { key: "planed_start_time", name: "Planed Start" },
    { key: "planed_end_time", name: "Planed End" },
    { key: "status_string", name: "Status" },
    {
      key: "report_string",
      name: "Report",
      formatter(props: any) {
        return (
          <Button
            onClick={() => setOperationId(props.row["id_operation_string"])}
          >
            {"Report"}
          </Button>
        );
      },
    },
  ];

  const operationsReportsColumns = [
    { key: "number_number", name: "Number", width: "max-content" },
    { key: "id_operation_string", name: "Operation ID" },
    { key: "real_start_time", name: "Real Start" },
    { key: "real_end_time", name: "Real End" },
  ];

  useEffect(() => {
    (async () => {
      const operationsResult = await fetch(
        "http://127.0.0.1:3001/api/operations",
        {
          mode: "cors",
        }
      );
      const { data: operationsData } = await operationsResult.json();

      const operationsReportsResult = await fetch(
        "http://127.0.0.1:3001/api/operations-reports",
        {
          mode: "cors",
        }
      );
      const { data: operationsReportsData } =
        await operationsReportsResult.json();

      const operationsRowsToSet = operationsData.map(
        (row: any, index: number) => ({
          number_number: index + 1,
          id_operation_string: row["id_operations"],
          operation_symbol: row["operation_symbol"],
          planed_start_time: new Date(row["planed_start"]).toLocaleString(),
          planed_end_time: new Date(row["planed_end"]).toLocaleString(),
          status_string: row["status"],
        })
      );

      const operationsReportsToSet = operationsReportsData.map(
        (row: any, index: number) => ({
          number_number: index + 1,
          id_operation_string: row["id_operations_reports"],
          real_start_time: new Date(row["real_start"]).toLocaleString(),
          real_end_time: new Date(row["real_end"]).toLocaleString(),
        })
      );

      // @ts-ignore
      setOperationsRows(operationsRowsToSet);
      // @ts-ignore
      setOperationsReportsRows(operationsReportsToSet);
    })();
  }, [operationId]);

  const onSendPress = async () => {
    const body = JSON.stringify({
      id_operations: operationId,
      // @ts-ignore
      real_start: timeStart.unix() * 1000,
      // @ts-ignore
      real_end: timeEnd.unix() * 1000,
    });

    console.log(body);

    await fetch("http://127.0.0.1:3001/api/operations-reports", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      body,
    });

    setOperationId(undefined);
    setTimeStart(null);
    setTimeEnd(null);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Modal open={!!operationId} onClose={() => setOperationId(undefined)}>
          <ModalContainer>
            <Stack spacing={3}>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label="Start"
                ampm={false}
                value={timeStart}
                onChange={(newValue) => {
                  setTimeStart(newValue);
                }}
              />
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label="End"
                ampm={false}
                value={timeEnd}
                onChange={(newValue) => {
                  setTimeEnd(newValue);
                }}
              />
              <Button onClick={onSendPress} variant="contained">
                Send
              </Button>
            </Stack>
          </ModalContainer>
        </Modal>
      </LocalizationProvider>
      <Table columns={operationsReportsColumns} rows={operationsReportsRows} />
      <Table columns={operationsColumns} rows={operationsRows} />
    </>
  );
};
export default OrdersReports;
