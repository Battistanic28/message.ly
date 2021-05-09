const express = require("express");
const db = require("../db");
const User = require("../models/user");
const {SECRET_KEY, BCRYPT_WORK_FACTOR} = require("../config")
const ExpressError = require("../expressError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = new express.Router();

router.post("/register", async function (req, res, next) {
    try {
        let {username} = await User.register(req.body);
        let token = jwt.sign({username}, SECRET_KEY);
        return res.json({token});
    }
    catch(e) {
        return next(e);
    }
});

router.post("/login", async function (req, res, next) {
    try {
        const {username, password} = req.body;
        const result = await db.query(`
            SELECT password 
            FROM users 
            WHERE username=$1`,
            [username]);
        const user = result.rows[0];

        if (user) {
            if (await bcrypt.compare(password, user.password) === true) {
                User.updateLoginTimestamp(username);
                return res.json({message: "Logged in!"})
            }
        }
        throw new ExpressError("Invalid user/password", 400);
    } catch(e) {
        return next(e);
    }
})
/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
 module.exports = router;