const express = require("express");

const router = express.Router();

const data = require("../data/artists.json");

router.get("/", (req, res, next) => {
    res.json(data);
});
router.get("/:id", (req, res, next) => {
    res.json(data.filter(e => req.params.id === e.ArtistID));
});
router.get("/nationality/:value", (req, res, next) => {
    res.json(data.filter(e => req.params.value === e.Nationality));
});
router.get("/name/:value", (req, res, next) => {
    res.json(data.filter(e => req.params.value === e.LastName));
});

module.exports = router;
