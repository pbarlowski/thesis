const sql = require("mssql");

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

const dropDb = async () => {
  await sql.connect(config).catch((e) => console.log("connecting error", e));

  await sql.query`drop table orders`.catch((e) =>
    console.log("query error", e.message)
  );
  await sql.query`drop table products`.catch((e) =>
    console.log("query error", e.message)
  );
  await sql.query`drop table schedules`.catch((e) =>
    console.log("query error", e.message)
  );
  await sql.query`drop table accidents`.catch((e) =>
    console.log("query error", e.message)
  );
  await sql.query`drop table operations`.catch((e) =>
    console.log("query error", e.message)
  );
  await sql.query`drop table processes`.catch((e) =>
    console.log("query error", e.message)
  );
  await sql.query`drop table reports`.catch((e) =>
    console.log("query error", e.message)
  );
  await sql.query`drop table machines`.catch((e) =>
    console.log("query error", e.message)
  );

  console.log("drop done");
};

dropDb();
