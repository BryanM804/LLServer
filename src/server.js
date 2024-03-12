const express = require("express");
const cors = require("cors");
const app = express();
const createConnection = require("./createConnection.js");

const con = createConnection();

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

        con.query(`SELECT * FROM lifts WHERE userID = 154820680687288320 ORDER BY setnumber DESC;`, (err2, results) => {
            if (err2) console.log(`Query error: ${err2}`);

            res.json(results);

            console.log("Brymul history fetched.")
        });
    });
});

app.get("/server/movements", (req, res) => {

    con.connect((err) => {
        if (err) console.log(`Connection error: ${err}`);

        con.query(`SELECT * FROM exercises;`, (err2, movements) => {
            res.json(movements);

            console.log("Movements fetched.");
        })
    })
});

app.listen(5000, () => {
    console.log("Server listening on port 5000...");
})