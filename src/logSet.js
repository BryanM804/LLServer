module.exports = (connection, setData) => {
    for (let i = 0; i < setData.sets; i++) {
        connection.connect((err) => {
            if (err) console.log(`Connection error: ${err}`);

            connection.query(`INSERT INTO lifts (userID, movement, weight, reps, date, setnumber) VALUES('${154820680687288320}', '${setData.movement}', ${setData.weight}, ${setData.reps}, '${setData.date}', 100000);`, (err2, result) => {
                if (err2) console.log(`Query error: ${err2}`);

                console.log(`[${setData.date}] User Logged ${setData.movement} ${setData.weight}lbs x ${setData.reps} reps for ${setData.sets} sets.`);
            })
        })
    }
}