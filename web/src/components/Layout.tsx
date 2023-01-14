import React from "react";

import { Outlet, useNavigate } from "react-router-dom";

import {
  Box,
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

const linkList1 = [
  { text: "Dashboard", path: "/dashboard", icon: <HomeIcon /> },
  { text: "Metrics", path: "/metrics", icon: <AnalyticsIcon /> },
  { text: "OEE", path: "/oee", icon: <InsightsIcon /> },
];

const linkList2 = [
  { text: "Products", path: "/products", icon: <CategoryIcon /> },
  { text: "Orders", path: "/orders", icon: <InventoryIcon /> },
  { text: "Machines", path: "/machines", icon: <PrecisionManufacturingIcon /> },
  { text: "Reports", path: "/reports", icon: <SummarizeIcon /> },
  { text: "Accidents", path: "/accidents", icon: <ReportProblemIcon /> },
];

const Layout = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
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
        <Toolbar />
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
      <Box
        component="main"
        sx={{
          alignItems: "flex-end",
          display: "flex",
          flex: 1,
          bgcolor: "background.default",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
