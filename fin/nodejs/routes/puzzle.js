import express from "express";
import {readJSON} from "../api/utility.js";
import {Puzzle, PuzzleDAO} from "../api/db.js";

const router = express.Router();

router
.use(express.static("./public"));

router
.get("/register", function (req, res) {
    try {
        res
        .status(200)
        .render("puzzle/layout", {
            "title" : "퍼즐 등록",
            "file" : "register",
            "puzzle" : readJSON("register.json")
        });
    } catch (err) {
        res.status(500).redirect("/error");
    }
})
.get("/play", function (req, res) {
    try {
        const puzzle = PuzzleDAO.getPuzzleByID(parseInt(req.query["id"]));

        if (puzzle) {
            res
            .status(200)
            .render("puzzle/layout", {
                "title" : "퍼즐 플레이",
                "file" : "play",
                "puzzle" : puzzle
            });
        } else {
            throw null;
        }
    } catch (err) {
        res.status(500).redirect("/error");
    }
});
router
.post("/examine", function (req, res) {
    const puzzle = Puzzle.makePuzzleWithTable(req.body);

    res
    .send(puzzle ? puzzle : false);
})
.post("/register", function (req, res) {
    const puzzle = Puzzle.makePuzzleWithTable(req.body);

    if (puzzle) {
        PuzzleDAO.createPuzzle(puzzle);

        res.send(true);
    } else {
        res.send(false);
    }
})
.post("/check", function (req, res) {
    res.send(Puzzle.compareClueAndTable(req.body));
})
.post("/delete", function (req, res) {
    const {id, password} = req.body;
    const puzzle = PuzzleDAO.getPuzzleByID(id);

    res.send(puzzle["password"] === password && PuzzleDAO.deletePuzzleByID(id));
});

export {
    router
};
