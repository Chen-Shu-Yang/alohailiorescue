//= ======================================================
//              Imports
//= ======================================================
// intialising pool
const pool = require('../controller/databaseConfig');

const User = {
    // Check for Guest User
    getGuestUser(deviceId, callback) {
        const sql = 'SELECT * FROM alohailiorescue.users WHERE USER_DEVICE = ?;';
        pool.query(sql, [deviceId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Add Guest Account into DB
    addGuestAccount(deviceId, callback) {
        const sql = `INSERT INTO alohailiorescue.users (USER_DEVICE) VALUES (?);`;
        pool.query(sql, [deviceId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Update Guest Account into DB
    updateGuestAccount(email, firstName, lastName, contactNo, userId, callback) {
        const sql = `UPDATE alohailiorescue.users SET USER_EMAIL = ?, FIRSTNAME = ?, LASTNAME = ?, USER_CONTACT = ? WHERE USERID = ?;`;
        pool.query(sql, [email, firstName, lastName, contactNo, userId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
}

//= ======================================================
//              Exports
//= ======================================================
module.exports = User;