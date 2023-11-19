// knexfile.ts
import { Knex } from "knex";
// const knex = Knex({
//     client: "pg",
//     connection: {
//       host : process.env.DB_HOST,
//       port : Number(process.env.DB_PORT) || 5432,
//       user : process.env.DB_USER || '',
//       password : process.env.DB_PASS || '',
//       database :process.env.DB || ''
//     }
//   });
//   export default knex;
export default module.exports = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || '',
    password: process.env.DB_PASS || '',
    database: process.env.DB || ''
  }
} as Knex.Config;