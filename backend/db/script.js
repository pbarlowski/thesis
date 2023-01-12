const sql = require("mssql");

const machines = require("./data/machines.json");
const processes = require("./data/processes.json");
const orders = require("./data/orders.json");

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

    // Orders table
    await sql.query`create table orders(
        id_orders UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        id_products UNIQUEIDENTIFIER FOREIGN KEY REFERENCES products(id_products),
        order_amount int NOT NULL )`;

    // Accidents table
    await sql.query`create table accidents(
        id_accidents UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        id_machines UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES machines(id_machines),
        accident_type varchar(255) NOT NULL,
        accidents_start DATETIME NOT NULL,
        accidents_end DATETIME NOT NULL)`;

    // Operation table
    await sql.query`create table operations(
        id_operations UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        id_machines UNIQUEIDENTIFIER  NOT NULL FOREIGN KEY REFERENCES machines(id_machines),
        id_processes UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES processes(id_processes),
        operation_symbol varchar(255) NOT NULL,
        setup_time int NOT NULL,
        time_per_unit int NOT NULL,
        processing_time int NOT NULL)`;

    // Schedule table
    await sql.query`create table schedule(
        id_schedule UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        id_orders UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES orders(id_orders),
        id_operations UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES operations(id_operations),
        planed_start DATETIME NOT NULL,
        planed_end DATETIME NOT NULL)`;

    // Report table
    await sql.query`create table reports(
        id_report UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        id_operations UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES operations(id_operations),
        real_start DATETIME NOT NULL,
        real_end DATETIME NOT NULL)`;

    console.log("tables created");
    // Insert data
    const promisesMachines = [];
    const promisesProcesses = [];
    const promisesOrders = [];

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
  } catch (e) {}
};

const dropDb = async () => {
  await sql.connect(config).catch((e) => console.log("connecting error", e));

  try {
    await sql.query`drop table accidents`;
    await sql.query`drop table reports`;
    await sql.query`drop table schedule`;
    await sql.query`drop table operations`;
    await sql.query`drop table orders`;
    await sql.query`drop table products`;
    await sql.query`drop table machines`;
    await sql.query`drop table processes`;
  } catch (e) {
    console.log("query error", e);
  }
  console.log("drop done");
};

configDb();
//dropDb();
