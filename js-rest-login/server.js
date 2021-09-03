
const express = require('express');
const cookieParser = require('cookie-parser');
const uuid = require('uuid').v4;
const app = express();
const PORT = 3000;

app.use(express.static('./public'));
app.use(cookieParser());
require('./sessions.js')(app);
var scoresData = require('./scores.js');

const scores = scoresData.scores

//GET API for getting object keys from scores
app.get('/scores', (req, res) => {
    res.json(Object.keys(scores));
});

//GET API for getting all the scores items along with item description
app.get('/scores/items/:username', (req, res) => {
    const username = req.params.username;
    res.json(scores[username]);
});

//GET API for getting items on the basis of item key
app.get('/scores/item/:id', (req, res) => {
    const id = req.params.id;
    const username = req.body.username
    if (scores[id]) {
        res.json(scores[username][id]);
    } else {
        res.status(404).json({ error: `Item dont exist in scores: ${id}` });
    }
});


//POST API for creating the item with name provided 
app.post('/scores/:name', express.json(), (req, res) => {
    const name = req.params.name.toLowerCase();
    const username = req.body.username

    const regex = /^[ A-Za-z]*$/;
    if (!name.match(regex)) {
        res.status(400).json({ error: 'Item name must be character of group of characters belonging to A-Z, a-z' });
        return;
    }

    if (!name) {
        res.status(400).json({ error: 'missing-name' });
        return;
    }

    //check if item already exist with same name in scores
    const existingObjectNameLength = Object.values(scores[username]).filter(inv => inv.name == name).length;
    if (existingObjectNameLength > 0) {
        res.status(409).json({ error: 'duplicate' });
        return;
    }

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const id = uuidv4();
    const itemId = id
    const score = 1;

    scores[username][id] = {
        itemId,
        name,
        score,
    };

    res.status(200).json(scores[username]);
});

//PUT API for updating score
app.put('/scores/score/:id', express.json(), (req, res) => {
    const id = req.params.id;
    const username = req.body.username;

    if (!id) {
        res.status(400).json({ error: 'missing-item' });
        return;
    }
    if (!scores[username][id]) {
        res.status(400).json({ msg: 'item doesnot exist in database' });
        return;
    }

    const itemId = scores[username][id].itemId;
    const name = scores[username][id].name;
    const scoreChange = req.body.scoreChange
    const score = scores[username][id].score + scoreChange;
    scores[username][id] = {
        itemId,
        name,
        score
    };
    res.status(200).json(scores[username][id]);
});

//DELETE API for deleting item using object key
app.delete('/scores/:id', express.json(), (req, res) => {
    const id = req.params.id;
    const username = req.body.username
    if (!id) {
        res.status(400).json({ error: 'missing-item' });
        return;
    }
    delete scores[username][id];
    res.status(200).json(scores[username]);
});


app.listen(PORT, () => console.log(`http://localhost:${PORT}`));