import React, { useEffect, useState } from "react";

import Table from "../components/Table";
import styled from "styled-components";
import { Button, Modal, TextField, Stack } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

const Graph = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  flex: 1;
`;

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
  const [data, setData] = useState();
  const [operationID, setOperationId] = useState();
  const [timeStart, setTimeStart] = useState(null);
  const [timeEnd, setTimeEnd] = useState(null);

  useEffect(() => {
    (async () => {
      const json = await fetch("http://127.0.0.1:3001/api/operations", {
        mode: "cors",
      });
      const { data } = await json.json();

      const rows = data.map((row: any) => ({
        id_operation_string: row["id_operations"],
        operation_symbol: row["operation_symbol"],
        planed_start_time: row["planed_start"],
        planed_end_time: row["planed_end"],
        status_string: row["status"],
      }));

      const dataToSet = {
        rows,
        columns: [
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
                  onClick={() =>
                    setOperationId(props.row["id_operation_string"])
                  }
                >
                  {"Report"}
                </Button>
              );
            },
          },
        ],
      };

      // @ts-ignore
      setData(dataToSet);
    })();
  }, []);

  const onSendPress = async () => {
    const body = JSON.stringify({
      id_operations: operationID,
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
        <Modal open={!!operationID} onClose={() => setOperationId(undefined)}>
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
export default OrdersReports;
