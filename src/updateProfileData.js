module.exports = (connection, data) => {

    connection.connect((err) => {
        if (err) console.log(`Connection error updating profile: ${err}`);

        connection.query(`SELECT * FROM accounts WHERE id=${data.userid}`, (err2, result) => {
            if (err2) console.log(`Query error fetching profile: ${err2}`);

            let currentLevel = result[0].level;
            let currentXP = result[0].xp + data.xpGain;

            if (data.xpGain > 0) {
                if (currentXP >= currentLevel * 1500) {
                    currentXP -= currentLevel * 1500;
                    currentLevel++;
                }
            } else {
                while (currentXP < 0) {
                    currentLevel--;
                    currentXP += currentLevel * 1500;
                }
            }
            
            connection.query(`UPDATE accounts SET level=${currentLevel}, xp=${currentXP} WHERE id='${data.userid}'`, (err3, result) => {
                if (err3) console.log(`Query error updating profile: ${err3}`);
            });
            
        });
    });
}