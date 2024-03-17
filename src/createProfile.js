module.exports = (con, username, callback) => {
    con.connect((err) => {
        if (err) console.log(`Connection error making profile: ${err}`);

        con.query(`SELECT userid FROM logins WHERE username='${username}'`, (err2, idarr) => {
            if (err2) console.log(`Query error making profile: ${err2}`);

            if (idarr.length > 0) {
                con.query(`INSERT INTO accounts (id, name, bodyweight, level, xp, creationdate, skiptotal, skipstreak) VALUES (
                    '${idarr[0].userid}',
                    '${username}',
                    0,
                    1,
                    0,
                    '${new Date().toDateString()}',
                    0,
                    0
                )`, (err3, result) => {
                    if (err3) console.log(`Query error making profile: ${err3}`);

                    if (callback) callback();
                })
            }
        })
    })
}