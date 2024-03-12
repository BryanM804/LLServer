const express = require("express");
const sql = require("mysql2");
const cors = require("cors");
const app = express();

const con = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "BryanSQL4154774514",
    database: "workoutdb"
});

// Makes the server CORS enabled
app.use(cors());

app.get("/server/user/brymul", (req, res) => {

    con.connect((err) => {
        if (err) console.log(`Connection error: ${err}`);

        con.query(`SELECT * FROM accounts WHERE name = 'brymul';`, (err2, results) => {
            if (err2) console.log(`Query error: ${err2}`);

            console.log(results);

            res.json(results[0]);
        });
    });

    console.log("User brymul fetched");
});

app.get("/server/history/154820680687288320", (req, res) => {

    con.connect((err) => {
        if (err) console.log(`Connection error: ${err}`);

        con.query(`SELECT * FROM lifts WHERE id = 154820680687288320;`, (err2, results) => {
            if (err2) console.log(`Query error: ${err2}`);

            console.log(results);

            res.json(results);
        });
    });
});

app.listen(5000, () => {
    console.log("Server listening on port 5000...");
})