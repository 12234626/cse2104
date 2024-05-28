import express from "express";
import {readJSON} from "../api/json.js";

const router = express.Router();

router.get("/", function (req, res) {
    const puzzles = readJSON("puzzles.json");

    res.render("main", {
        "title" : "메인 페이지",
        // "popular_puzzle" : puzzles.slice(-5),
        "recent_puzzle" : puzzles.slice(-5).reverse(),
        "random_puzzle" : puzzles.sort(() => Math.random() - 0.5).slice(-5)
    });
});

export {
    router
};
