let fs = require('fs');
const path = require('path');
const http = require('http');
const ZipStream = require('zip-stream');

const express = require('express');
const router = express.Router();

/* GET api listing. */
router.get('/', function (req, res) {
    res.send('api works');
});


blob_extensions = ['ico', 'jpg', 'png', 'svg'];
const templateFolder = './templates';

fileSet = [];

// Process directory and add each file to set
function readDir(baseDir, dir) {
    // console.log(dir);
    fs.readdir(path.join(baseDir, dir), (err, files) => {
        files.forEach(file => {
            let fullPath = path.join(baseDir, dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                // The file is a directory
                readDir(baseDir, path.join(dir, file));
            } else {
                // Process file
                readFile(baseDir, dir, file);
            }
        });
    });
}

// Add file to set
function readFile(baseDir, dir, fileName) {
    // Check if file is an image
    let extensionSplit = fileName.split(".");
    let extension = extensionSplit[extensionSplit.length - 1];
    let fullPath = path.join(baseDir, dir, fileName);
    // console.log(extension);
    if (blob_extensions.indexOf(extension) >= 0) {
        fs.readFile(fullPath, function (err, data) {
            if (err) throw err;
            templateData = {
                name: fileName,
                path: dir,
                data: data
            };
            fileSet.push(templateData);
        });
    } else {
        // console.log(fullPath);
        fs.readFile(fullPath, 'utf8', function (err, data) {
            if (err) throw err;
            templateData = {
                name: fileName,
                path: dir,
                template: data
            };
            fileSet.push(templateData);
        });
    }
}

readDir(templateFolder, '/');

router.get('/test', function (req, res) {

    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', 'attachment; filename=sample-project.zip');

    let archive = new ZipStream();

    archive.on('error', function (err) {
        throw err;
    });

    archive.pipe(res);

    archiveFilesRecursively(archive, fileSet, 0);
});


function archiveFilesRecursively(archive, files, index) {
    if (index < files.length) {
        let file = files[index];
        if (file.template) { // text file - process template
            archive.entry(file.template, {name: path.join(file.path, file.name)}, function () {
                archiveFilesRecursively(archive, files, index + 1);
            });
        } else { // image file - write raw data
            archive.entry(file.data, {name: path.join(file.path, file.name)}, function () {
                archiveFilesRecursively(archive, files, index + 1);
            });
        }
    } else {
        archive.finalize();
    }
}


module.exports = router;
