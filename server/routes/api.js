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
const templateFolder = './templates';

// fs.readdir(testFolder, (err, files) => {
//     files.forEach(file => {
//         console.log(file);
//         fs.readFile(path.join(testFolder, file), 'utf8', (err, data) => {
//             if (err) throw err;
//             console.log(data);
//         });
//     });
// });

fileSet = new Set();

// Process directory and add each file to set
function readDir(dir) {
    console.log(dir);
    fs.readdir(dir, (err, files) => {
        files.forEach(file => {
            let fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                // The file is a directory
                readDir(fullPath);
            } else {
                // Process file
                fs.readFile(fullPath, 'utf8', function (err, data) {
                    if (err) throw err;
                    console.log('read ' + fullPath);
                    // console.log(data);
                });
            }
        });
    });
}

// Add file to set
function readFile(name, fullPath, content) {

}

readDir(templateFolder);

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

    for (let file of fileSet) {
        console.log(file.name);
        console.log(file.path);
        console.log(file.template);
    }

    zip.entry(source, {name: "test-directory/test-file"}, function () {
        console.log("Zipped test files");
    });

    zip.finalize();

});


module.exports = router;
