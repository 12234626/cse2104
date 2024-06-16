import express from "express";
import {PuzzleDAO} from "../api/db.js";

const router = express.Router();

router.get("/", function (req, res) {
    try {
        res
        .status(200)
        .render("main", {
            "title" : "메인 페이지",
            "recent" : PuzzleDAO.getPuzzles().sort("date", true).slice(0, 5).puzzles,
            "random" : PuzzleDAO.getPuzzles().sort("random", false).slice(0, 5).puzzles
        });
    } catch (err) {
        res.status(500).redirect("/error");
    }
});

export {
    router
};
