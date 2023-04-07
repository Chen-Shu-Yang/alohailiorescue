const pool = require('../controller/databaseConfig');

const Story = {
    // Get stories
    getStories(rowLimit, callback) {
        const sql = `SELECT * FROM alohailiorescue.stories LIMIT ${rowLimit};`;
        pool.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Get featured stories
    getFeaturedStories(callback) {
        console.log(typeof(limit));
        const sql = `SELECT * FROM alohailiorescue.stories WHERE FEATURED = 'Y' LIMIT 5;`;
        console.log(sql);
        pool.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Get stories by slug
    getStoriesBySlug(slug, callback) {
        const sql = `SELECT * FROM alohailiorescue.stories WHERE STORY_SLUG = ?;`;
        pool.query(sql, [slug], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Get stories by id
    getStoriesById(id, callback) {
        const sql = `SELECT * FROM alohailiorescue.stories WHERE STORYID = ?;`;
        pool.query(sql, [id], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Post new story
    postStory(title, slug, description, content, callback) {
        const sql = `
            INSERT INTO 
                alohailiorescue.stories (STORY_TITLE, STORY_DES, STORY_SLUG, STORY_CONTENT)
            VALUES 
                (?,?,?,?);
        `;
        pool.query(sql, [title, description, slug, content], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // Update story
    updateStory(title, slug, description, content, storyId, callback) {
        const sql = `
            UPDATE
                alohailiorescue.stories 
            SET 
                STORY_TITLE = ?, STORY_DES = ?, STORY_SLUG = ?, STORY_CONTENT = ? WHERE STORYID = ?;
        `;
        pool.query(sql, [title, description, slug, content, storyId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
    // delete story
    deleteStory(storyId, callback) {
        const sql = `DELETE FROM alohailiorescue.stories WHERE STORYID = ?`;
        pool.query(sql, [storyId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result);
        });
    },
}

//= ======================================================
//              Exports
//= ======================================================
module.exports = Story;