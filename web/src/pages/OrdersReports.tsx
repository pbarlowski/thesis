import React, { useEffect, useState } from "react";

import Table from "../components/Table";
import styled from "styled-components";
import { Button, Modal, TextField, Stack } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

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
  const [orderID, setOrderId] = useState();
  const [valid, setValid] = useState("");
  const [eligible, setEligible] = useState("");
  const [typeError, setTypeError] = useState(false);

  useEffect(() => {
    (async () => {
      const json = await fetch("http://127.0.0.1:3001/api/orders", {
        mode: "cors",
      });
      const { data } = await json.json();

      const rows = data.map((row: any) => ({
        id_orders_report_string: row["id_orders"],
        order_amount_number: row["order_amount"],
        status_string: row["status"],
      }));

      const dataToSet = {
        rows,
        columns: [
          { key: "id_orders_report_string", name: "Order ID" },
          { key: "order_amount_number", name: "Order Amount" },
          { key: "status_string", name: "Status" },
          {
            key: "report_string",
            name: "Report",
            formatter(props: any) {
              return (
                <Button
                  onClick={() =>
                    setOrderId(props.row["id_orders_report_string"])
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

  const onValidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValid(event.target.value);
  };
  const onEligibleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEligible(event.target.value);
  };

  const onSendPress = async () => {
    if (valid === null || valid === "" || eligible === "")
      return setTypeError(true);

    const body = JSON.stringify({
      id_orders: orderID,
      products_valid: parseInt(valid, 10),
      products_eligible: parseInt(eligible, 10),
    });

    console.log(body);

    await fetch("http://127.0.0.1:3001/api/orders-reports", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      body,
    });

    setOrderId(undefined);
    setEligible("");
    setValid("");
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Modal open={!!orderID} onClose={() => setOrderId(undefined)}>
          <ModalContainer>
            <Stack spacing={3}>
              <TextField
                fullWidth
                value={valid}
                onChange={onValidChange}
                error={typeError}
                required
                label="Valid Products"
              />
              <TextField
                fullWidth
                value={eligible}
                onChange={onEligibleChange2}
                error={typeError}
                required
                label="Eligible Products"
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
