const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
const createConnection = require("./createConnection.js");

const logSet = require("./logSet.js");
const undoSet = require("./undoSet.js");
const calculateSetTotal = require("./calculateSetTotal.js");
const updateProfileData = require("./updateProfileData.js");
const createUserRoute = require("./createUserRoute.js");
const authUser = require("./authUser.js");

const con = createConnection();

// Middlewares
// CORS
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.post("/auth", (req, res) => {
    const enteredUser = req.body;

    authUser(con, enteredUser, (isAuth) => {
        if (isAuth) {
            const token = jwt.sign(enteredUser, "tempPassKey", { expiresIn: "1h" });

            res.json({ message: "Login verified.", username: enteredUser.username, discordid: "154820680687288320", token: token  });
            //discord id is temp
        } else {
            res.json({ message: "Invalid login" });
        }
    });
});

app.get("/user/:username", (req, res) => {

    const username = req.params.username;

    con.connect((err) => {
        if (err) console.log(`Connection error: ${err}`);

        con.query(`SELECT * FROM accounts WHERE name = '${username}';`, (err2, results) => {
            if (err2) console.log(`Query error: ${err2}`);

            console.log(`Successfully retreived profile for ${results[0].name}`);

            res.json(results[0]);
        });
    });

    console.log(`User ${username} fetched`);
});


app.get("/history/:userid", (req, res) => {

    const userid = req.params.userid;

    con.connect((err) => {
        if (err) console.log(`Connection error: ${err}`);

        con.query(`SELECT * FROM lifts WHERE userID = '${userid}' ORDER BY setnumber DESC;`, (err2, results) => {
            if (err2) console.log(`Query error: ${err2}`);

            res.json(results);

            console.log(`Successfully retreived history for ${userid}`);
        });
    });
});

app.get("/movements", (req, res) => {

    con.connect((err) => {
        if (err) console.log(`Connection error: ${err}`);

        con.query(`SELECT * FROM exercises;`, (err2, movements) => {
            res.json(movements);

            console.log("Movements fetched.");
        })
    })
});

app.post("/log", (req, res) => {
    const set = req.body;
    const updateData = {
        "xpGain": (calculateSetTotal(set.movement, set.weight, set.reps) + 100) * set.sets,
        "userid": set.userid
    }

    updateProfileData(con, updateData);
    logSet(con, set);
    
    res.json({message: "Server received POST request." });
})

app.post("/undo", (req, res) => {
    const undoSets = req.body;

    undoSet(con, undoSets);

    res.json({ message: "Server received undo request." })
})

app.options("/auth", (req, res) => {
    res.header({
        "Access-Control-Allow-Origin": req.headers.origin
    });
})

app.post("/createuser", (req, res) => {
    const newUserData = req.body;

    con.connect((err) => {
        if (err) console.log(`Connection error creating account: ${err}`);

        con.query(`INSERT INTO logins (username, password) VALUES ('${newUserData.username}', '${newUserData.password}')`, (err2, result) => {
            if (err2) console.log(`Query error creating account: ${err2}`);

            console.log(`Account ${newUserData.username} successfully created.`);
            res.json({ message: "User created." });
        })
    })
});

app.listen(5000, () => {
    console.log("Server listening on port 5000...");
})