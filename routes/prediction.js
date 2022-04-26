const express = require('express');
const router = express.Router();

const {spawn} = require('child_process');

router.post('/prediction', (req, res) => {
    console.log(req.body.symptom1);
    const python = spawn('python', ['predict.py',req.body.symptom1,req.body.symptom2,req.body.symptom3,req.body.symptom4,req.body.symptom5]);
    python.stdout.on('data', function (data) {
        res.send(JSON.stringify(data.toString()));
    });
})

module.exports = router;