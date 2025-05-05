const express = require("express");
const router = express.Router();
//posts
//Index
router.get("/", (req, res) => {
    res.send("GET for post");
});

//show
router.get("/:id", (req, res) => {
    res.send("Get for posts id")
});

router.post("/", (req, res) => {
    res.send("POST for posts");
});

//Delete
router.delete("/:id", (req, res) => {
    res.send("DELETE for post id");
});

module.exports = router;