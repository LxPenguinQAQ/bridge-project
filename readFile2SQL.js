const fs = require("fs");
const db = require("./mysql.js");

/* let num = 23;
let id = 1;
while (num <= 34) {
    let fileName = `macid${num++}.txt`;
    const content = fs.readFileSync(fileName, "utf8");
    const arr = content.split("\n").map(str=> {
        str = str.replace("\r", "");
        return str.split(" ### ");
    });
    for (let i=0; i<arr.length; i++) {
        const sql = `INSERT INTO sensor_data (id, installAddress, macaddress) VALUES (${id++}, '${arr[i][1]}', '${arr[i][0]}')`;
        db.query(sql, (err, data)=> {
            if (err) {
                console.log(err);
            } else {
                console.log(`${id}, ${arr[i][1]}, ${arr[i][0]} finished`);
                console.log("#".repeat(25));
            }
        })
    }
} */
let id = 1;
let fileName = 'mac2install.txt';
const content = fs.readFileSync(fileName, "utf8");
const arr = content.split("\n").map(str=> {
    str = str.replace("\r", "");
    return str.split(" ### ");
});
for (let i=0; i<arr.length; i++) {
    const sql = `INSERT INTO sensor_data (id, installAddress, macaddress) VALUES (${id++}, '${arr[i][1]}', '${arr[i][0]}')`;
    db.query(sql, (err, data)=> {
        if (err) {
            console.log(err);
        } else {
            console.log(`${id}, ${arr[i][1]}, ${arr[i][0]} finished`);
            console.log("#".repeat(25));
        }
    })
}
