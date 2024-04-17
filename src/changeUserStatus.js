module.exports = (con, userid, status) => {
    con.connect((err) => {
        if (err) console.error(err);

        con.query(`UPDATE accounts SET status = '${status}' WHERE id = '${userid}';`, (err2, result) => {
            if (err2) console.log(`Error setting status: ${err2}`);
        });
    });
}