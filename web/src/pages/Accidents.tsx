import React, { useState, useEffect } from "react";

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

const Accidents = () => {
  const [data, setData] = useState();
  const [operationId, setOperationId] = useState();
  const [type, setType] = useState("");
  const [typeError, setTypeError] = useState(false);
  const [timeStart, setTimeStart] = useState(null);
  const [timeEnd, setTimeEnd] = useState(null);

  useEffect(() => {
    (async () => {
      const json = await fetch("http://127.0.0.1:3001/api/operations", {
        mode: "cors",
      });
      const { data } = await json.json();

      const rows = data.map((row: any) => ({
        id_operations_string: row["id_operations"],
        operation_symbol_string: row["operation_symbol"],
        machine_id_string: row["machine_id"],
        machine_type_string: row["machine_type"],
        report_string: row["id_operations"],
      }));

      const dataToSet = {
        rows,
        columns: [
          { key: "id_operations_string", name: "Operation ID" },
          { key: "operation_symbol_string", name: "Operation Symbol" },
          { key: "machine_id_string", name: "Machine ID" },
          { key: "machine_type_string", name: "Machine Type" },
          {
            key: "report_string",
            name: "Report",
            formatter(props: any) {
              return (
                <Button
                  onClick={() =>
                    setOperationId(props.row["id_operations_string"])
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

  const onTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeError) setTypeError(false);
    setType(event.target.value);
  };

  const onSendPress = async () => {
    if (type.length === 0) return setTypeError(true);

    const body = JSON.stringify({
      id_operations: operationId,
      accident_type: type,
      // @ts-ignore
      accident_start: timeStart.unix() * 1000,
      // @ts-ignore
      accident_end: timeEnd.unix() * 1000,
    });

    console.log(body);

    await fetch("http://127.0.0.1:3001/api/accidents-reports", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      body,
    });

    setOperationId(undefined);
    setType("");
    setTimeStart(null);
    setTimeEnd(null);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Modal open={!!operationId} onClose={() => setOperationId(undefined)}>
          <ModalContainer>
            <Stack spacing={3}>
              <TextField
                fullWidth
                value={type}
                onChange={onTypeChange}
                error={typeError}
                required
                label="Accident Type"
              />
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

export default Accidents;
