import express from "express";
import {readJSON} from "../api/json.js";
import {solve} from "../api/wasm.js";
import {getPuzzleByID, makeClue, makePuzzle, appendPuzzle, deletePuzzle} from "../api/puzzle.js";
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
    const {author, title, row, col, table} = req.body, clue = makeClue(row, col, table);
    const {result, xd, logic} = solve(clue);

    if (result) {
        res.send(makePuzzle(0, author, "", title, clue, xd, logic));
    } else {
        res.send({});
    }
})
.post("/register", function (req, res) {
    const {password, author, title, row, col, table} = req.body, clue = makeClue(row, col, table);
    const {result, xd, logic} = solve(clue);

    if (result) {
        appendPuzzle(makePuzzle(getID(), author, password, title, clue, xd, logic));

        res.send(true);
    } else {
        res.send(false);
    }
})
.post("/solve", function (req, res) {
    const {clue, table} = req.body;
    const {result} = solve(clue);
    let flag = true;

    for (let i = 0; i < clue[0]; ++i) for (let j = 0; j < clue[1]; ++j) if ((result[i][j] === 2) !== (table[i][j] === 2)) flag = false;
    res.send(flag);
})
.post("/delete", function (req, res) {
    const {id, password} = req.body;
    const puzzle = getPuzzleByID(id);

    res.send(puzzle["password"] === password && deletePuzzle(id));
});

export {
    router
};
