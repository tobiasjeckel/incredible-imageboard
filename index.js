const express = require("express");
const app = express();
const db = require("./utils/db");

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
