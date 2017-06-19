let fs = require('fs');
const path = require('path');
const http = require('http');
const zipStream = require('zip-stream');
const mustache = require('mustache');
const express = require('express');
const router = express.Router();


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

router.get('/project', function (req, res) {

    let config = {
        firebaseConfig: `{
  apiKey: 'YOUR_API_KEY_HERE',
  authDomain: 'YOUR_AUTH_DOMAIN_HERE',
  databaseURL: 'YOUR_DATABASE_URL_HERE',
  projectId: 'YOUR_PROJECT_ID_HERE',
  storageBucket: 'YOUR_STORAGE_BUCKET_HERE',
  messagingSenderId: 'YOUR_MESSENGER_SENDER_ID_HERE'
}`,
        firebaseConfigLocation: "src/app/config/firebase-config.ts",
        author: "Deb K Banerji",
        projectName: "Test Project",
        projectNameCamelCase: "TestProject",
        projectNameKebabCase: "test-project",
        projectDescription: "Testing the initializer"
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
        // TODO: Save record of config?
        console.log("Created " + config.projectName)
    }
}


module.exports = router;
