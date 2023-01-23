// @ts-ignore
import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from "@mui/material";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const TopContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const BottomContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-evenly;
  align-items: center;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 20px;
  border: #d3d3d3 2px solid;
  background-color: #f7f7f7;
`;

const Item = styled.div`
  width: 250px;
  height: 250px;
`;

const SelectContainer = styled.div`
  margin: 36px 36px 0 36px;
  display: flex;
  justify-content: center;
`;

type MetricProps = {
  value: number;
  title: string;
};

const Metric: React.FC<MetricProps> = ({ value, title }) => {
  return (
    <ItemContainer>
      <Item>
        <CircularProgressbar
          value={Math.floor(value * 100)}
          text={`${Math.floor(value * 100)}%`}
        />
      </Item>
      <Typography variant="h4" sx={{ marginTop: "16px" }}>
        {title}
      </Typography>
    </ItemContainer>
  );
};

const OEE = () => {
  const [machine, setMachine] = useState("");
  const [machines, setMachines] = useState([]);

  const [data, setData] = useState({
    availability: 1,
    quality: 1,
    performance: 1,
    oee: 1,
  });

  useEffect(() => {
    (async () => {
      const machinesResult = await fetch("http://127.0.0.1:3001/api/machines", {
        mode: "cors",
      });

      const { data: machines } = await machinesResult.json();

      console.log(machines);

      setMachines(machines);

      setMachine(machines[0]["id_machines"]);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (machine.length === 0) return;

      const availabilityResult = await fetch(
        `http://127.0.0.1:3001/api/availability/?machine=${machine}`,
        {
          mode: "cors",
        }
      );

      const qualityResult = await fetch(
        `http://127.0.0.1:3001/api/quality/?machine=${machine}`,
        {
          mode: "cors",
        }
      );

      const performanceResult = await fetch(
        `http://127.0.0.1:3001/api/performance/?machine=${machine}`,
        {
          mode: "cors",
        }
      );

      const { data: availability } = await availabilityResult.json();
      const { data: quality } = await qualityResult.json();
      const { data: performance } = await performanceResult.json();
      const oee = availability * quality * performance;

      console.log(availability, quality, performance, oee);

      setData({ availability, quality, performance, oee });
    })();
  }, [machine]);

  const onSelectChange = (event: SelectChangeEvent) => {
    setMachine(event.target.value);
  };

  return (
    <Container>
      <SelectContainer>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-autowidth-label">
            Machine
          </InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            value={machine}
            label="Machine"
            onChange={onSelectChange}
          >
            {machines.map((machine) => (
              <MenuItem value={machine["id_machines"]}>
                {machine["machine_id"]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </SelectContainer>
      <TopContainer>
        <Metric value={data.oee} title="OEE" />
      </TopContainer>
      <BottomContainer>
        <Metric value={data.performance} title="Performance" />
        <Metric value={data.quality} title="Quality" />
        <Metric value={data.availability} title="Availability" />
      </BottomContainer>
    </Container>
  );
};

export default OEE;
