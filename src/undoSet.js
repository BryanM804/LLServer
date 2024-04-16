const calculateSetTotal = require("./calculateSetTotal.js");
const updateProfileData = require("./updateProfileData.js");

module.exports = (connection, undoData) => {

    connection.connect((err) => {
        if (err) console.log(`Connection error: ${err}`);

        let updateData = {
            "xpGain": 0,
            "userid": undoData[0].userID
        }

        for (const undoSet of undoData) {

            updateData.xpGain += (calculateSetTotal(undoSet.movement, undoSet.weight, undoSet.reps) + 100) * -1;

            connection.query(`DELETE FROM lifts WHERE setid=${undoSet.setid}`, (err2, result) => {
                if (err) console.log(`Query error: ${err2}`);
    
                console.log(`User undid set: ${undoSet.setid} (${undoSet.movement}, ${undoSet.weight} x ${undoSet.reps})`);
            });
        }

        updateProfileData(connection, updateData);
    })
}