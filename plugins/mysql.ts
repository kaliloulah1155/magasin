import mysql from "mysql";

export default defineNuxtPlugin((app) => {
  const connection = mysql.createConnection({
    host: "vps93697.serveur-vps.net",
    user: "c1ibson",
    port: 3306,
    password: "Zthqz#XTA6",
    database: "c1gep_db",
  });
  connection.connect();


  /*try {
   connection.query(
     "SELECT 1 + 1 AS solution",
     function (error, results, fields) {
       if (error) throw error;
       console.log("The solution is: ", results[0].solution);
     }
   );
  } catch (err) {
    console.error("MySQL query error:", err);
  } */

  return {
    provide: {
      mysql: connection,
    },
  };
});
