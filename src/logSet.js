const calculateSetTotal = require("./calculateSetTotal.js");

module.exports = (connection, setData) => {
    for (let i = 0; i < setData.sets; i++) {

        let setTotal = calculateSetTotal(setData.movement, setData.weight, setData.reps);

        connection.connect((err) => {
            if (err) console.log(`Connection error: ${err}`);

            connection.query(`INSERT INTO lifts (userID, movement, weight, reps, date, settotal, dateval, time) 
                    VALUES('${setData.userid}', '${setData.movement}', ${setData.weight}, ${setData.reps}, '${setData.date}', ${setTotal}, ${Date.parse(setData.date)}, '${new Date().toLocaleTimeString("en-US")}');`, (err2, result) => {
                if (err2) console.log(`Query error: ${err2}`);

                console.log(`[${setData.date}] User ${setData.userid} Logged ${setData.movement} ${setData.weight}lbs x ${setData.reps} reps for ${setData.sets} sets.`);
            })
        })
    }
}