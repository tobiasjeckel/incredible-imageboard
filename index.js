const express = require("express");
const app = express();
const db = require("./utils/db");
//file upload boilerplate
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//file upload boilerplate

app.use(express.static("public"));

app.listen(8080, () => console.log("image board server is running"));

app.get("/main", (req, res) => {
    db.getImages()
        .then(data => {
            res.json(data.rows);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/upload", uploader.single("file"), (req, res) => {
    if (req.file) {
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});
