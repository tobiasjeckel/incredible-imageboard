const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

exports.getImages = function() {
    return db.query(
        `SELECT url, title, id, (
            SELECT id
            FROM images
            ORDER BY id ASC
            LIMIT 1
        ) AS "lowestid"
        FROM images
        ORDER BY id DESC
        LIMIT 9`
    );
};

exports.getMoreImages = function(id) {
    return db.query(
        `SELECT url, title, id
        FROM images
        WHERE id < $1
        ORDER by id DESC
        LIMIT 9`,
        [id]
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
        WHERE id = $1`,
        [id]
    );
};

exports.getComments = function(id) {
    return db.query(
        `SELECT comment, username, created_at
        FROM comments
        WHERE image_id = $1
        ORDER BY id DESC`,
        [id]
    );
};

exports.addComment = function(comment, username, id) {
    return db.query(
        `INSERT INTO comments (comment, username, image_id)
        VALUES ($1, $2, $3)
        RETURNING comment, username, created_at`,
        [comment, username, id]
    );
};
