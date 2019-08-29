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
//>> last image in list will have lowest id, use that id to getMoreImages where id <$1
//SELECT WHERE id < $1
//know when to not show the more button anymore, infinite scroll wont have this problem but is overall more complicated
//what is the lowest id of an image in my database alltogether, this is 1 (hardcoded). after this dont show more anymore. this however doesnt support image deletion. do a query to find out what the lowest number is. select id as "lowestid" from images order by id asc limit 1. or make it a subquery.

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
