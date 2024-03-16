module.exports = (connection, enteredData, callback) => {
    connection.connect((err) => {
        if (err) console.log(`Connection error authenitcating: ${err}`);

        connection.query(`SELECT username, password FROM LOGINS`, (err2, logins) => {
            if (err2) console.log(`Query error authenticating: ${err2}`);

            let isAuth = false;
            let userid = "";

            for (const login of logins) {
                if (login.username == enteredData.username && login.password == enteredData.password) {
                    isAuth = true;
                    break;
                }
            }

            console.log(`User exists: ${isAuth}`);
            if (callback) callback(isAuth);
        });
    });
}