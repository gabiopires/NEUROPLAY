import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: '137.131.193.98',
    port: 28142,
    user: 'neuroplay',
    password: 'n$uroPl@y123456',
    database: 'neuroplay',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;