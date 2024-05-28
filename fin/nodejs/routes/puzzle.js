import express from "express";
import {readJSON} from "../api/json.js";
import {solve} from "../api/wasm.js";
import {getPuzzleByID, makePuzzle, appendPuzzle, deletePuzzle} from "../api/puzzle.js";
import {getID} from "../api/id.js";

const router = express.Router();

router
.use(express.static("./public"));

router
.get("/register", function (req, res) {
    res.render("puzzle/layout", {
        "title" : "퍼즐 등록",
        "file" : "register",
        "puzzle" : readJSON("blank_puzzle.json")
    });
})
.get("/play", function (req, res) {
    const puzzle = getPuzzleByID(parseInt(req.query["id"]));

    if (puzzle) {
        res.render("puzzle/layout", {
            "title" : "퍼즐 플레이",
            "file" : "play",
            "puzzle" : puzzle
        });
    } else {
        res.redirect("/error");
    }
});
router
.post("/examine", function (req, res) {
    const {author, title, clue} = req.body;
    const {result, xd, logic} = solve(clue);

    if (result) {
        res.send(makePuzzle(0, author, "", title, clue, xd, logic));
    } else {
        res.send({});
    }
})
.post("/register", function (req, res) {
    const {password, author, title, clue} = req.body;
    const {result, xd, logic} = solve(clue);

    if (result) {
        appendPuzzle(makePuzzle(getID(), author, password, title, clue, xd, logic));

        res.send(true);
    } else {
        res.send(false);
    }
})
.post("/solve", function (req, res) {
    const {clue} = req.body;
    const {result} = solve(clue);

    if (result) {
        res.send(result);
    } else {
        res.send([]);
    }
})
.post("/delete", function (req, res) {
    const {id, password} = req.body;
    const puzzle = getPuzzleByID(id);

    res.send(puzzle["password"] === password && deletePuzzle(id));
});

export {
    router
};
