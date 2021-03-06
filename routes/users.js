const express = require("express");
const db = require("../db");
const ExpressError = require("../expressError");
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");

const User = require("../models/user");

const router = new express.Router();


router.get("/", ensureLoggedIn, async function(req, res, next) {
    try {
        const users = await User.all();
        return res.json({users});
    } 
    catch(e) {
        return next(e);
    }
});

router.get("/:username", ensureCorrectUser, async function(req, res, next) {
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

router.get("/:username/to", ensureCorrectUser, async function(req, res, next) {
    try {
        const username = req.params.username;
        const messages = await User.messagesTo(username);
        if (!messages) {
            throw new ExpressError(`No messages found to user ${username}.`, 404)
        }
        return res.json(messages);
    } catch(e) {
        return next(e);
    }
})

router.get("/:username/from", ensureCorrectUser, async function(req, res, next) {
    try {
        const username = req.params.username;
        const messages = await User.messagesFrom({username});
        if (!messages) {
            throw new ExpressError(`No messages found from user ${username}.`, 404)
        }
        return res.json({messages});
    } catch(e) {
        return next(e);
    }
})

module.exports = router;
