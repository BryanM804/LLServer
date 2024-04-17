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
const changeUserStatus = require("./changeUserStatus.js");
const createUserRoute = require("./createUserRoute.js");
const createProfile = require("./createProfile.js");
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
            // Change tempPassKey to ENV variable at some point -----------
            const token = jwt.sign(enteredUser, "tempPassKey", { expiresIn: "4h" });

            con.connect((err) => {
                if (err) console.log(`Connection error authenticating: ${err}`);

                con.query(`SELECT id FROM accounts WHERE name='${enteredUser.username}';`, (err2, result) => {
                    if (err2) console.log(`Query error authenticating: ${err2}`);

                    if (result.length > 0) {
                        res.json({ message: "Login verified.", username: enteredUser.username, discordid: result[0].id, token: token  });
                    } else {
                        con.query(`SELECT userid FROM logins WHERE username='${enteredUser.username}';`, (err3, result2) => {
                            if (err3) console.log(`Query error authenticating: ${err3}`);

                            if (result2.length > 0) {
                                res.json({ message: "Login verified.", username: enteredUser.username, discordid: result2[0].userid, token: token  });

                                changeUserStatus(con, result2[0].userid, "online");

                                setTimeout(() => {
                                    changeUserStatus(con, result2[0].userid, "offline");
                                }, 1000); // remember to change this to 4 hours later

                            } else {
                                res.json({ message: "error" });
                                throw new Error("Unexpected lack of userid.");
                            }
                        })
                    }
                });
            })
        } else {
            res.json({ message: "Invalid login" });
        }
    });
});

app.post("/resolveRequest", (req, res) => {
    const resolution = req.body.resolution;
    const requestid = req.body.friendid;

    con.connect((err) => {
        if (resolution === "accept") {
            const date = new Date().toDateString();

            // Set friends status to friends
            con.query(`UPDATE friends WHERE friendid = ${requestid} SET status = 'friends', origindate = '${date}';`, (err2, result) => {
                if (err2) console.log(`Error updating friend status: ${err2}`);

                res.json({ message: "Request accepted." });
                console.log(`Request ${requestid} accepted.`);
            })

        } else { // deny

            // Delete friend request
            con.query(`DELETE FROM friends WHERE friendid = ${requestid}`, (err2, result) => {
                if (err2) console.log(`Error updating friend status: ${err2}`);
                
                res.json({ message: "Request denied" });
                console.log(`Request ${requestid} denied.`);
            })
        }
    });
});

app.post("/sendrequest", (req, res) => {
    const request = req.body;

    con.connect((err) => {
        if (err) console.error(err);
        con.query(`SELECT * FROM friends WHERE (sendername = '${request.senderName}' AND receivername = '${request.receiverName}')
                OR (sendername = '${request.receiverName} AND receivername = '${request.senderName}');`, (err2, result) => {
            if (result != null && result.length > 0) {
                res.json({ message: "Request already exists" });
            } else {
                con.query(`INSERT INTO friends (sendername, receivername, status) 
                        VALUES ('${request.senderName}', '${request.receiverName}', 'pending');`, (err2, result) => {
                    res.json({ message: "Request sent." });

                    console.log(`${request.senderName} sent a friend request to ${request.receiverName}.`);
                });
            }
        });
    });
})

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

app.get("/friends/:username", (req, res) => {
    const name = req.params.username;

    con.connect((err) => {
        if (err) console.error(err);

        con.query(`SELECT * FROM friends WHERE (sendername = '${name}' OR receivername = '${name}') 
                AND status = 'friends';`, (err2, results) => {
            if (err2) console.log(`Query error getting friends: ${err2}`);

            res.json(results);
            
            console.log(`Fetched friends for ${name}.`);
        });
    });
});

app.get("/requests/:username", (req, res) => {
    const name = req.params.username
    
    con.connect((err) => {
        if (err) console.error(err);

        con.query(`SELECT * FROM friends WHERE (sendername = '${name}' OR receivername = '${name}') 
        AND status = 'pending';`, (err2, results) => {
            if (err2) console.log(`Query error getting friend requests: ${err2}`);
            
            res.json(results);
            console.log(`Fetched requests for ${name}.`);
        });
    });
});

app.get("/history/:userid", (req, res) => {

    const userid = req.params.userid;

    con.connect((err) => {
        if (err) console.log(`Connection error: ${err}`);

        con.query(`SELECT * FROM lifts WHERE userID = '${userid}' ORDER BY dateval DESC, setid DESC;`, (err2, results) => {
            if (err2) console.log(`Query error: ${err2}`);

            res.json(results);

            console.log(`Successfully retreived history for ${userid}`);
        });
    });
});

app.get("/label/:userid/:date", (req, res) => {
    const userid = req.params.userid;
    const date = req.params.date;

    con.connect((err) => {
        if (err) console.log(`Connection error: ${err}`);

        con.query(`SELECT label FROM labels WHERE userID='${userid}' AND date='${date}' ORDER By labelid DESC`, (err2, result) => {
            if (err2) console.log(`Error querying for label: ${err2}`);

            res.json(result);
            console.log(`Fetched label for user ${userid}`);
        })
    })
});

app.post("/addlabel", (req, res) => {
    const label = req.body;

    con.connect((err) => {
        if (err) console.log(`Connection error: ${err}`);

        con.query(`INSERT INTO labels (userID, label, date) VALUES ('${label.userid}', '${label.label}', '${label.date}')`, (err2, result) => {
            if (err2) console.log(`Query error inserting label: ${err2}`);

            console.log(`Added label ${label.label}`);
            res.json({ message: "Label added successfully" });
        })
    })
});

app.post("/changestat", (req, res) => {
    const newStat = req.body;

    con.connect((err) => {
        if (err) console.log(`Connection error: ${err}`);

        con.query(`UPDATE accounts SET ${newStat.type.toLowerCase()}=${newStat.value} WHERE id='${newStat.userid}';`, (err2, result) => {
            if (err2) console.log(`Query error updating stats: ${err2}`);

            console.log(`Set user ${newStat.userid}'s ${newStat.type} to ${newStat.value}`);
            res.json({ message: `Updated ${newStat.type} successfully` });
        })
    })
})

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

app.post("/createuser", (req, res) => {
    const newUserData = req.body;

    con.connect((err) => {
        if (err) console.log(`Connection error creating account: ${err}`);

        con.query(`SELECT username FROM logins WHERE username='${newUserData.username}'`, (usernameError, existingUsers) => {
            if (usernameError) console.log(`Query error checking for duplicate username: ${usernameError}`);

            if (existingUsers.length > 0) {
                res.json({ message: "Username taken." });
            } else {
                // Attempts to link the discord id if the user already is using the discord bot
                con.query(`SELECT id FROM accounts WHERE name='${newUserData.username}'`, (err2, existingId) => {
                    if (err2) console.log(`Query error checking for existing discord user: ${err2}`);

                    let discordid = "";

                    if (existingId.length > 0) {
                        discordid = existingId[0].id;
                    }

                    con.query(`INSERT INTO logins (username, password, discordid) VALUES ('${newUserData.username}', '${newUserData.password}', '${discordid}')`, (err2, result) => {
                        if (err2) console.log(`Query error creating account: ${err2}`);
            
                        console.log(`Account ${newUserData.username} successfully created.`);

                        if (existingId.length == 0) {
                            createProfile(con, newUserData.username, () => {
                                res.json({ message: "User created." });
                            });
                        } else {
                            res.json({ message: "User created." });
                        }
                    })
                })
            }
        })
    })
});

app.listen(5000, () => {
    console.log("Server listening on port 5000...");
})