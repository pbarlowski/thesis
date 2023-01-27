import React, { useState, useEffect } from "react";

import Table from "../components/Table";
import styled from "styled-components";
import { Button, Modal, TextField, Stack } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import moment from "moment";

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
  const [operationsRows, setOperationsRows] = useState([]);
  const [accidentsRows, setAccidentsRows] = useState([]);
  const [operationId, setOperationId] = useState();

  const [type, setType] = useState("");
  const [timeStart, setTimeStart] = useState(null);
  const [typeError, setTypeError] = useState(false);
  const [timeEnd, setTimeEnd] = useState(null);

  const operationsColumns = [
    { key: "number_number", name: "Number", width: "max-content" },
    { key: "id_order_string", name: "Order Name" },
    { key: "operation_symbol_string", name: "Operation Symbol" },
    { key: "machine_id_string", name: "Machine ID" },
    { key: "machine_type_string", name: "Machine Type" },
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

  const accidentsColumns = [
    { key: "number_number", name: "Number", width: "max-content" },
    { key: "id_accidents_string", name: "Accident ID" },
    { key: "accident_type_string", name: "Type" },
    { key: "accident_start_time", name: "Accident Start" },
    { key: "accident_end_time", name: "Accident End" },
    { key: "accident_total_number", name: "Total Time (Minutes)" },
  ];

  useEffect(() => {
    (async () => {
      const operationsResult = await fetch(
        "http://127.0.0.1:3001/api/operations",
        {
          mode: "cors",
        }
      );

      const accidentsResult = await fetch(
        "http://127.0.0.1:3001/api/accidents-reports",
        {
          mode: "cors",
        }
      );

      const { data: operationsData } = await operationsResult.json();

      const { data: accidentsData } = await accidentsResult.json();

      const operationsRowsToSet = operationsData.map(
        (row: any, index: number) => ({
          number_number: index + 1,
          id_order_string: row["order_name"],
          operation_symbol_string: row["operation_symbol"],
          id_operation_string: row["id_operations"],
          machine_id_string: row["machine_id"],
          machine_type_string: row["machine_type"],
          report_string: row["id_operations"],
        })
      );

      const accidentsRowsToSet = accidentsData.map(
        (row: any, index: number) => ({
          number_number: index + 1,
          id_accidents_string: row["id_accidents_reports"],
          accident_type_string: row["accident_type"],
          accident_start_time: moment(row["accident_start"]).format(
            "D/MM/YY H:mm"
          ),
          accident_end_time: moment(row["accident_end"]).format("D/MM/YY H:mm"),
          accident_total_number:
            (moment(row["accident_end"]).unix() -
              moment(row["accident_start"]).unix()) /
            60,
        })
      );

      // @ts-ignore
      setOperationsRows(operationsRowsToSet);
      // @ts-ignore
      setAccidentsRows(accidentsRowsToSet);
    })();
  }, [operationId]);

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
      <Table columns={accidentsColumns} rows={accidentsRows} />
      <Table columns={operationsColumns} rows={operationsRows} />
    </>
  );
};

export default Accidents;
