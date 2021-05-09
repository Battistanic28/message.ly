const express = require("express");
const db = require("../db");
const Message = require("../models/message");

const User = require("../models/message");

const router = new express.Router();


router.post("/", async function(req, res, next) {
    try {
        const {from_username, to_username, body} =req.body;
        const result = await Message.create({from_username, to_username, body});
        return res.json({result});
    } catch(e) {
        return next(e);
    }
});
/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
 module.exports = router;
