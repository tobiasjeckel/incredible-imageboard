const express = require("express");
const app = express();
const db = require("./utils/db");
//file upload boilerplate
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const config = require("./config");

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

app.use(express.json());

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

app.get("/main/:id", (req, res) => {
    db.getMoreImages()
        .then(data => {
            res.json(data.rows);
        })
        .catch(err => {
            console.log("error when loading more images", err);
        });
});

app.get("/imageinfo/:id", (req, res) => {
    const id = req.params.id;
    db.getImageData(id)
        .then(data => {
            console.log("imageinfo is: ", data.rows[0]);
            res.json(data.rows[0]);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/comments/:id", (req, res) => {
    const id = req.params.id;
    db.getComments(id)
        .then(data => {
            console.log("log of array of comments: ", data.rows);
            res.json(data.rows);
        })
        .catch(err => {
            console.log("error when getting comments", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    const url = config.s3Url + filename;
    const { title, username, description } = req.body;

    //put it into database after doing aws stuff, unshift image into images array

    db.addImage(url, username, title, description)
        .then(data => {
            res.json(data.rows[0]);
            // console.log("log of data from index.js", data.rows);
        })
        .catch(err => {
            console.log("error when adding image to database: ", err);
        });
});

app.post("/comments/:id", (req, res) => {
    const { username, comment } = req.body;
    const id = req.params.id;
    console.log(
        "stuff being added to db.addComment request (comment, username, id): ",
        comment,
        username,
        id
    );
    db.addComment(comment, username, id)
        .then(data => {
            res.json(data.rows[0]);
            console.log("log of addComment response: ", res);
        })
        .catch(err => {
            console.log("error when adding comment to database: ", err);
        });
});
