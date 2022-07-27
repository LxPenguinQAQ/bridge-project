// 封装连接库代码，支持连接池
const db = {};
const mysql = require('mysql');
const pool = mysql.createPool({
    // connectionLimit: 10,
    host: '47.97.11.140',
    user: 'root',
    password: 'njupt202',
    database: 'bridgedata',
    // 统一数据库时区
    timezone: "utc"
});

db.query = function(sql, callback) {
    if (!sql) {
        callback();
        return;
    }
    pool.query(sql, (err, rows, fields)=> {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, rows, fields);
    });
}
module.exports = db;

