const express = require('express');
const cookieParser = require('cookie-parser');
var scoresData = require('./scores.js');
const scores = scoresData.scores
const uuid = require('uuid').v4;

module.exports = function (app) {

    const sessions = {};

    const validateUsername = function (username) {
        const errors = [];
        const clean = username.replace(/[^A-Za-z0-9_]+/g, '');
        if (clean !== username) {
            errors.push('Username contained disallowed characters, It should be A-Za-z0-9_');
        }
        if (!username) {
            errors.push('Username was empty');
        }
        if (username.length < 4) {
            errors.push("Username should be at least 4 characters");
        }

        return errors.length > 0 ? errors : '';
    };


    const isValidSession = function (sid) {
        return sessions[sid];
    };

    const createSession = function (username) {
        const sid = uuid();
        if (!(username in scores)) {
            scores[username] = {}
        }
        sessions[sid] = {
            username,
            scores: scores[username],
        };
        return sid;
    };

    app.get('/session', (req, res) => {
        // check cookie from request
        const sid = req.cookies.sid;
        if (!sid) {
            res.status(401).json({ error: 'login-required' });
            return;
        }
        if (isValidSession(sid)) {
            res.status(200).json(sessions[sid]);
            return;
        }

        res.status(403).json({ error: 'login-invalid' });
    });

    app.post('/session', express.json(), (req, res) => {
        const { username } = req.body;
        const errors = validateUsername(username);
        if (errors) {
            res.status(400).json({ errors });
            return;
        }
        const sid = createSession(username);
        res.cookie('sid', sid);
        res.status(200).json(sessions[sid]);
    });

    app.post('/logout', express.json(), (req, res) => {
        res.clearCookie('sid')
        res.status(200).json({});
    });


}