const sql = require("mssql");

const machines = require("./data/machines.json");
const processes = require("./data/processes.json");
const orders = require("./data/orders.json");
const operations = require("./data/operations.json");

const config = {
  user: "SA",
  password: "<YourStrong@Passw0rd>",
  server: "127.0.0.1",
  database: "script",
  options: {
    trustedconnection: true,
    enableArithAbort: true,
    trustServerCertificate: true,
    instancename: "",
  },
  port: 1433,
};

const configDb = async () => {
  await sql.connect(config).catch((e) => console.log("connecting error", e));

  try {
    // Process table
    await sql.query`create table processes(
        id_processes UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        process_id varchar(255) NOT NULL,
        process_name varchar(255) NOT NULL)`;

    // Machines table
    await sql.query`create table machines(
        id_machines UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        machine_id varchar(255) NOT NULL,
        machine_type varchar(255) NOT NULL)`;

    // Products table
    await sql.query`create table products(
        id_products UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        product_valid int NOT NULL,
        product_eligible int NOT NULL)`;

    // Operation table
    await sql.query`create table operations(
        id_operations UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        fk_machines UNIQUEIDENTIFIER  NOT NULL FOREIGN KEY REFERENCES machines(id_machines),
        fk_processes UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES processes(id_processes),
        operation_symbol varchar(255) NOT NULL,
        setup_time int NOT NULL,
        time_per_unit int NOT NULL)`;

    // Schedules table
    await sql.query`create table schedules(
        id_schedules UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        fk_operations UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES operations(id_operations),
        planed_start DATETIME NOT NULL,
        planed_end DATETIME NOT NULL,
        processing_time int NOT NULL)`;

    // Orders table
    await sql.query`create table orders(
        id_orders UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        fk_products UNIQUEIDENTIFIER FOREIGN KEY REFERENCES products(id_products),
        fk_schedules UNIQUEIDENTIFIER FOREIGN KEY REFERENCES schedules(id_schedules),
        order_amount int NOT NULL )`;

    // Accidents table
    await sql.query`create table accidents(
        id_accidents UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        fk_machines UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES machines(id_machines),
        accident_type varchar(255) NOT NULL,
        accidents_start DATETIME NOT NULL,
        accidents_end DATETIME NOT NULL)`;

    // Report table
    await sql.query`create table reports(
        id_reports UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        fk_operations UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES operations(id_operations),
        real_start DATETIME NOT NULL,
        real_end DATETIME NOT NULL)`;

    console.log("tables created");
    // Insert data
    const promisesMachines = [];
    const promisesProcesses = [];
    const promisesOrders = [];
    const promisesOperations = [];
    const promisesSchedules = [];

    // Machines data
    machines.forEach((machine) => {
      const promise = sql.query`insert into machines ( machine_id, machine_type) values (${machine.machine_id}, ${machine.machine_type})`;
      promisesMachines.push(promise);
    });

    await Promise.all(promisesMachines);
    console.log("machines done");

    // Processes data
    processes.forEach((process) => {
      const promise = sql.query`insert into processes ( process_id, process_name) values (${process.process_id}, ${process.process_name})`;
      promisesProcesses.push(promise);
    });

    await Promise.all(promisesProcesses);
    console.log("processes done");

    // Orders data
    orders.forEach((order) => {
      const promise = sql.query`insert into orders ( order_amount) values (${order.order_amount})`;
      promisesOrders.push(promise);
    });

    await Promise.all(promisesOrders);
    console.log("orders done");

    // Operations data

    const operationsOrders = [];
    const machinesResult = await sql.query`select * from machines`;
    const processesResult = await sql.query`select * from processes`;

    const operationsData = operations.map((operation, index) => {
      return {
        fk_machines:
          machinesResult.recordset[
            Math.floor(Math.random() * machinesResult.rowsAffected[0])
          ]["id_machines"],
        fk_processes:
          processesResult.recordset[
            Math.floor(Math.random() * processesResult.rowsAffected[0])
          ]["id_processes"],
        ...operation,
      };
    });

    operationsData.forEach((operation) => {
      const promise = sql.query`insert into operations ( fk_machines, fk_processes, operation_symbol, setup_time, time_per_unit) values (${operation.fk_machines}, ${operation.fk_processes}, 
      ${operation.operation_symbol},${operation.setup_time},${operation.time_per_unit})`;
      promisesOperations.push(promise);
    });

    await Promise.all(promisesOperations);
    console.log("operations done");

    // Schedules data
    const operationsResult = await sql.query`select * from operations`;
    const ordersResult = await sql.query`select * from orders`;
    const schedulesData = [];

    let time = new Date();

    for (const index in ordersResult.recordset) {
      const processing_time =
        ordersResult.recordset[index]["order_amount"] *
          operationsResult.recordset[index]["time_per_unit"] +
        operationsResult.recordset[index]["setup_time"];
      const planed_start = time;
      time = new Date(time.getTime() + processing_time * 60000);
      const planed_end = time;
      schedulesData.push({
        fk_operations: operationsResult.recordset[index].id_operations,
        planed_start,
        planed_end,
        processing_time,
      });
    }

    schedulesData.forEach((schedule) => {
      const promise = sql.query`insert into schedules ( fk_operations, planed_start, planed_end, processing_time) values (${schedule.fk_operations}, ${schedule.planed_start},
      ${schedule.planed_end},${schedule.processing_time})`;
      promisesSchedules.push(promise);
    });

    await Promise.all(promisesSchedules);

    console.log("schedules done");

    const schedulesResults = await sql.query`select * from schedules`;

    const ordersData = schedulesResults.recordset.map((schedule, index) => ({
      id_orders: ordersResult.recordset[index]["id_orders"],
      fk_schedules: schedule.id_schedules,
    }));

    const ordersDataPromises = [];

    ordersData.forEach((order) => {
      const promise = sql.query`update orders set fk_schedules=${order.fk_schedules} where id_orders=${order.id_orders}`;
      ordersDataPromises.push(promise);
    });

    await Promise.all(ordersDataPromises);

    console.log("done");
  } catch (e) {
    console.error(e);
  }
};

configDb();
