module.exports = (connection, undoData) => {
    for (const undoSet of undoData) {
        connection.connect((err) => {
            if (err) console.log(`Connection error: ${err}`);

            connection.query(`DELETE FROM lifts WHERE setid=${undoSet.setid}`, (err2, result) => {
                if (err) console.log(`Query error: ${err2}`);

                console.log(`User undid set: ${undoSet.setid} (${undoSet.movement}, ${undoSet.weight} x ${undoSet.reps})`);
            });
        });
    }
}