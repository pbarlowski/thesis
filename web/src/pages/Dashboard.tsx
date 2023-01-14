import React from "react";

import Table from "../components/Table";

const data = {
  columns: ["ID, Name, Status"],
  rows: [{ id: 1, name: "Name", status: "Status" }],
};

const Dashboard = () => {
  return <Table />;
};

export default Dashboard;
