let fs = require('fs');
const path = require('path');
const http = require('http');

const express = require('express');
const router = express.Router();

/* GET api listing. */
router.get('/', function (req, res) {
  res.send('api works');
});


const testFolder = './test_template';

fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    console.log(file);
    fs.readFile(path.join(testFolder, file), 'utf8', (err, data) => {
      if (err) throw err;
      console.log(data);
    });
  });
});

router.get('/test', function (req, res) {

  res.set('Content-Type', 'application/zip');
  res.set('Content-Disposition', 'attachment; filename=response-file.zip');

  var ZipStream = require('zip-stream');
  var zip = new ZipStream();

  zip.on('error', function (err) {
    throw err;
  });

  zip.pipe(res);

  // items.forEach(function (item) {
  //
  //   wait.for(function (next) {
  //
  //     var path = storage.getItemPath(req.Box, item);
  //     var source = "ABCDEFG"
  //
  //     zip.entry(source, { name: item.name }, next);
  //   })
  //
  // });


  var source = "ABCDEFG";

  zip.entry(source, { name: "test-file" }, function () {
    console.log("Zipped test files");
  });

  zip.finalize();

});


module.exports = router;
