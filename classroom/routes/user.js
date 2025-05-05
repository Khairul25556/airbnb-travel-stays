const express = require("express");
const router = express.Router();
//user
//Index
router.get("/", (req, res) => {
    res.send("GET for user");
});

//show
router.get("/:id", (req, res) => {
    res.send("Get for users id")
});

router.post("/", (req, res) => {
    res.send("POST for users");
});

//Delete
router.delete("/:id", (req, res) => {
    res.send("DELETE for users id");
});

module.exports = router;