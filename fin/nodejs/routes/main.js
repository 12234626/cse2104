import express from "express";
import {PuzzleDAO} from "../api/db.js";

const router = express.Router();

router.get("/", function (req, res) {
    res.render("main", {
        "title" : "메인 페이지",
        "recent" : PuzzleDAO.sortBy(PuzzleDAO.getPuzzles(), "date", true).slice(0, 5),
        "random" : PuzzleDAO.sortBy(PuzzleDAO.getPuzzles(), "random", false).slice(0, 5)
    });
});

export {
    router
};
