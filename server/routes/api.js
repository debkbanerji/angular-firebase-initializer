let fs = require('fs');
const path = require('path');

const express = require('express');
const router = express.Router();

/* GET api listing. */
router.get('/', function (req, res) {
  res.send('api works');
});


const testFolder = './templates';

fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    console.log(file);
    fs.readFile(path.join(testFolder, file), 'utf8', (err, data) => {
      if (err) throw err;
      console.log(data);
    });
  });
});

module.exports = router;
