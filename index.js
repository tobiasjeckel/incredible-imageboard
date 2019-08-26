const express = require("express");
const app = express();

app.use(express.static("public"));

app.listen(8080, () => console.log("image board server is running"));

app.get("/cities", (req, res) => {
    let cities = [
        { name: "Berlin", size: "big" },
        { name: "Frankfurt", size: "small" },
        { name: "Hamburg", size: "medium" }
    ];
    console.log("I hit the cities route");
    res.json(cities);
});
