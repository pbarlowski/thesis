import React from "react";

import { Outlet, useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import InsightsIcon from "@mui/icons-material/Insights";
import SummarizeIcon from "@mui/icons-material/Summarize";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import InventoryIcon from "@mui/icons-material/Inventory";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import CategoryIcon from "@mui/icons-material/Category";
import styled from "styled-components";

const linkList1 = [
  { text: "Dashboard", path: "/dashboard", icon: <HomeIcon /> },
  { text: "Metrics", path: "/metrics", icon: <AnalyticsIcon /> },
  { text: "OEE", path: "/oee", icon: <InsightsIcon /> },
];

const linkList2 = [
  { text: "Products", path: "/products", icon: <CategoryIcon /> },
  { text: "Orders", path: "/orders", icon: <InventoryIcon /> },
  { text: "Machines", path: "/machines", icon: <PrecisionManufacturingIcon /> },
  { text: "Orders Reports", path: "/orders-reports", icon: <SummarizeIcon /> },
  {
    text: "Operations Reports",
    path: "/operations-reports",
    icon: <SummarizeIcon />,
  },
  { text: "Accidents", path: "/accidents", icon: <ReportProblemIcon /> },
];

const MainContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const OutletContainer = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Layout = () => {
  const navigate = useNavigate();

  return (
    <MainContainer>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: "300px",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "300px",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Avatar>OP</Avatar>
          <Button variant="contained">Logout</Button>
        </Toolbar>
        <Divider />
        <List>
          {linkList1.map((item, index) => (
            <ListItem key={item.text}>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {linkList2.map((item, index) => (
            <ListItem key={item.text}>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <OutletContainer>
        <Outlet />
      </OutletContainer>
    </MainContainer>
  );
};

export default Layout;
