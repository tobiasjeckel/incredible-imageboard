const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

exports.getImages = function() {
    return db.query(
        `SELECT url, title, id
        FROM images
        ORDER BY created_at DESC`
    );
};

exports.addImage = function(url, username, title, description) {
    return db.query(
        `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING url, title, id`,
        [url, username, title, description]
    );
};

exports.getImageData = function(id) {
    return db.query(
        `SELECT url, username, title, description, created_at
        FROM images
        WHERE $1 = id`,
        [id]
    );
};
