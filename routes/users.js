const express = require("express");
const db = require("../db");
const ExpressError = require("../expressError");

const User = require("../models/user");

const router = new express.Router();


router.get("/", async function(req, res, next) {
    try {
        const users = await User.all();
        return res.json({users})
    } 
    catch(e) {
        return next(e);
    }
});


router.get("/:username", async function(req, res, next) {
    try {
        const username = req.params.username;
        const user = await User.get(username);
        if (!user) {
            throw new ExpressError(`User ${username} not found.`, 404)
        }
        return res.json(user);
    } catch(e) {
        return next(e);
    }
})

router.get("/:username/to", async function(req, res, next) {
    try {
        const username = req.params.username;
        const messages = await User.messagesTo(username);
        if (!messages) {
            throw new ExpressError(`User ${messages} not found.`, 404)
        }
        return res.json(messages);
    } catch(e) {
        return next(e);
    }
})

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
module.exports = router;
