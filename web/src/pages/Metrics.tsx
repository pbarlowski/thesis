import React, { useEffect, useState } from "react";
import {
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from "@mui/material";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const TopContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

const Item = styled.div`
  display: flex;
  flex: 1;
`;

const ItemContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 36px;
  border-radius: 20px;
  border: #d3d3d3 2px solid;
  background-color: #f7f7f7;
  justify-content: center;
  align-items: center;
`;

const BottomContainer = styled.div`
  display: flex;
  flex: 1;
`;

const SelectContainer = styled.div`
  margin: 36px 36px 0 36px;
  display: flex;
  justify-content: center;
`;

type MetricProps = {
  title?: string;
  value?: string | number;
};

const Metric: React.FC<MetricProps> = ({ title, value }) => {
  return (
    <Item>
      <ItemContent>
        <Typography variant="h3" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4">{value}</Typography>
      </ItemContent>
    </Item>
  );
};

const generateData = (mtbf: number) => {
  const maxTime = mtbf * 5;
  const data = [];

  for (let t = 0; t <= maxTime; t += 500)
    data.push({ time: t, reliability: Math.pow(Math.E, -(t / mtbf)) });

  return data;
};

const Metrics = () => {
  const [machine, setMachine] = useState("");
  const [machines, setMachines] = useState([]);

  const [data, setData] = useState({
    mttr: 0,
    mttf: 0,
    mtbf: 0,
    failureRate: "0",
    chartData: [],
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

      const mttrResult = await fetch(
        `http://127.0.0.1:3001/api/mttr/?machine=${machine}`,
        {
          mode: "cors",
        }
      );

      const mttfResult = await fetch(
        `http://127.0.0.1:3001/api/mttf/?machine=${machine}`,
        {
          mode: "cors",
        }
      );

      const mtbfResult = await fetch(
        `http://127.0.0.1:3001/api/mtbf/?machine=${machine}`,
        {
          mode: "cors",
        }
      );

      const { data: mttr } = await mttrResult.json();
      const { data: mttf } = await mttfResult.json();
      const { data: mtbf } = await mtbfResult.json();

      // @ts-ignore
      const failureRate = !mtbf ? 0 : parseFloat(1 / mtbf).toFixed(6);
      const chartData = generateData(mtbf);

      // @ts-ignore
      setData({ mttr, mttf, mtbf, failureRate, chartData });
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
        <Metric title="MTTR" value={data?.mttr + " min"} />
        <Metric title="MTTF" value={data?.mttf + " min"} />
        <Metric title="MTBF" value={data?.mtbf + " min"} />
        <Metric title="Failure Rate" value={data?.failureRate} />
      </TopContainer>
      <BottomContainer>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data?.chartData}
            margin={{
              top: 30,
              right: 30,
              left: 30,
              bottom: 50,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time">
              <Label
                value="Time (minutes)"
                offset={-20}
                position="insideBottom"
              />
            </XAxis>
            <YAxis>
              <Label
                value="Reliability"
                offset={0}
                angle={-90}
                position="insideLeft"
              />
            </YAxis>
            <Tooltip
              formatter={(value, name, props) => [`${value}`, "Reliability"]}
            />
            <Line
              type="monotone"
              dataKey="reliability"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </BottomContainer>
    </Container>
  );
};

export default Metrics;
