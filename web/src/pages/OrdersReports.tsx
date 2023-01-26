import React, { useEffect, useState } from "react";

import Table from "../components/Table";
import styled from "styled-components";
import { Button, Modal, TextField, Stack } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

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
  const [ordersRows, setOrdersRows] = useState([]);
  const [ordersReportRows, setOrdersReportsRows] = useState([]);
  const [orderId, setOrderId] = useState();

  const [valid, setValid] = useState("");
  const [eligible, setEligible] = useState("");
  const [typeError, setTypeError] = useState(false);

  const ordersColumns = [
    { key: "number_number", name: "Number", width: "max-content" },
    { key: "order_name_string", name: "Order Name" },
    { key: "order_amount_number", name: "Order Amount" },
    { key: "order_status_string", name: "Order Status" },
    {
      key: "report_string",
      name: "Report",
      formatter(props: any) {
        return (
          <Button
            disabled={
              props.row["order_status_string"] !== "done" ||
              !!props.row["id_orders_reports_string"]
            }
            onClick={() => setOrderId(props.row["id_orders_string"])}
          >
            {"Report"}
          </Button>
        );
      },
    },
  ];

  const ordersReportsColumns = [
    { key: "number_number", name: "Number", width: "max-content" },
    { key: "id_orders_reports_string", name: "Order Report ID" },
    { key: "products_valid_number", name: "Product Valid" },
    { key: "products_eligible_number", name: "Product Eligible" },
  ];

  useEffect(() => {
    (async () => {
      const ordersResult = await fetch("http://127.0.0.1:3001/api/orders", {
        mode: "cors",
      });
      const { data: ordersData } = await ordersResult.json();

      const ordersReportResult = await fetch(
        "http://127.0.0.1:3001/api/orders-reports",
        {
          mode: "cors",
        }
      );
      const { data: ordersReportData } = await ordersReportResult.json();

      const ordersRowsToSet = ordersData.map((row: any, index: number) => ({
        number_number: index + 1,
        id_orders_reports_string: row["id_orders_reports"],
        id_orders_string: row["id_orders"],
        order_name_string: row["order_name"],
        order_amount_number: row["order_amount"],
        order_status_string: row["order_status"],
      }));

      const ordersReportsRowsToSet = ordersReportData.map(
        (row: any, index: number) => ({
          number_number: index + 1,
          id_orders_reports_string: row["id_orders_reports"],
          products_valid_number: row["products_valid"],
          products_eligible_number: row["products_eligible"],
        })
      );

      // @ts-ignore
      setOrdersRows(ordersRowsToSet);
      // @ts-ignore
      setOrdersReportsRows(ordersReportsRowsToSet);
    })();
  }, [orderId]);

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
      id_orders: orderId,
      products_valid: parseInt(valid, 10),
      products_eligible: parseInt(eligible, 10),
    });

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
        <Modal open={!!orderId} onClose={() => setOrderId(undefined)}>
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
      <Table columns={ordersReportsColumns} rows={ordersReportRows} />
      <Table columns={ordersColumns} rows={ordersRows} />
    </>
  );
};
export default OrdersReports;
