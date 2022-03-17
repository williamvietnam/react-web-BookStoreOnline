import mysql from 'mysql'
import env from '../env';

let connection;
// let connection = mysql.createConnection({
//     host: env.MYSQL_HOST,
//     user: env.MYSQL_USER,
//     password: env.MYSQL_PASSWORD,
//     database: env.MYSQL_DB_NAME,
//     port: env.MYSQL_PORT
// });

function createConnection() {
    connection =  mysql.createPool({
        host: env.MYSQL_HOST,
        user: env.MYSQL_USER,
        password: env.MYSQL_PASSWORD,
        database: env.MYSQL_DB_NAME,
        port: env.MYSQL_PORT
    });
}

createConnection();

export default connection;