let fs = require('fs');
const path = require('path');
const http = require('http');
const zipStream = require('zip-stream');
const mustache = require('mustache');
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
            let templateData = {
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

    let config = {
        firebaseConfig: "FIREBASE CONFIG HERE",
        firebaseConfigLocation: "src/app/config/firebase-config.ts",
        author: "Deb",
        projectName: "Apple Timer",
        projectNameCamelCase: "AppleTimer",
        projectNameKebabCase: "apple-timer",
        projectDescription: "A Better Timer (well, not really)"
    };

    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', 'attachment; filename=' + config.projectNameKebabCase + '.zip');

    let archive = new zipStream();

    archive.on('error', function (err) {
        throw err;
    });

    archive.pipe(res);

    archiveFilesRecursively(archive, fileSet, 0, config);
});


function archiveFilesRecursively(archive, files, index, config) {
    if (index < files.length) {
        let file = files[index];
        if (file.template) { // text file - process template
            console.log("Rendering " + path.join(file.path, file.name));
            let output = mustache.render(file.template, config);
            archive.entry(output, {name: path.join(file.path, file.name)}, function () {
                archiveFilesRecursively(archive, files, index + 1, config);
            });
        } else { // image file - write raw data
            archive.entry(file.data, {name: path.join(file.path, file.name)}, function () {
                archiveFilesRecursively(archive, files, index + 1, config);
            });
        }
    } else {
        archive.finalize();
    }
}


module.exports = router;
