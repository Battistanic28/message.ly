const express = require("express");
const db = require("../db");
const Message = require("../models/message");

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

router.get("/:id", async function(req, res, next) {
    try {
        const {id} = req.params;
        const result = await Message.get(id);
        return res.json({result})
    } catch(e) {
        return next(e);
    }
})

router.post("/:id/read", async function(req, res, next) {
    try {
        const {id} = req.params;
        const result = await Message.markRead(id);
        return res.json({result})
    } catch(e) {
        return next(e);
    }
})
/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
 module.exports = router;
