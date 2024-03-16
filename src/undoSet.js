const calculateSetTotal = require("./calculateSetTotal.js");
const updateProfileData = require("./updateProfileData.js");

module.exports = (connection, undoData) => {
    for (const undoSet of undoData) {

        const updateData = {
            "xpGain": (calculateSetTotal(undoSet.movement, undoSet.weight, undoSet.reps) + 100) * -1,
            "userid": undoSet.userID
        }
    
        updateProfileData(connection, updateData);

        connection.connect((err) => {
            if (err) console.log(`Connection error: ${err}`);

            connection.query(`DELETE FROM lifts WHERE setid=${undoSet.setid}`, (err2, result) => {
                if (err) console.log(`Query error: ${err2}`);

                console.log(`User undid set: ${undoSet.setid} (${undoSet.movement}, ${undoSet.weight} x ${undoSet.reps})`);
            });
        });
    }
}