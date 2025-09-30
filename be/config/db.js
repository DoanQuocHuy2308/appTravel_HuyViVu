const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    multipleStatements: true 
}).promise();

async function connect(){
    try {
        await connection.getConnection();
        console.log('Connected to MySQL');
    } catch (error) {
        console.error('Error connecting to MySQL:', error);
    }
}
connect();
module.exports = connection; 
