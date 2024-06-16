import express from "express";
import {calcPage} from "../api/utility.js";
import {PuzzleDAO} from "../api/db.js";

const router = express.Router();

router
.use(express.static("./public"));

router
.get("/all", function (req, res) {
    try {
        const {page} = req.query;
        
        res
        .status(200)
        .render("search/layout", {
            "file" : "all",
            "title" : "전체 퍼즐",
            "form" : {},
            ...calcPage(PuzzleDAO.getPuzzles().sort("date", true).puzzles, parseInt(page) || 1)
        });
    } catch (err) {
        res.status(500).redirect("/error");
    }
})
.get("/query", function (req, res) {
    try {
        const {col_min, col_max, row_min, row_max, logic_false, logic_true, xd_min, xd_max, xd_mag_min, xd_mag_max, date_start, date_end, sort, reverse, page} = req.query;
        const query = {
            "col_min" : parseInt(col_min) || 1,
            "col_max" : parseInt(col_max) || 200,
            "row_min" : parseInt(row_min) || 1,
            "row_max" : parseInt(row_max) || 200,
            "logic_false" : logic_false === "true",
            "logic_true" : logic_true === "true",
            "xd_min" : parseInt(xd_min) || 1,
            "xd_max" : parseInt(xd_max) || 100,
            "xd_mag_min" : parseInt(xd_mag_min) || 1,
            "xd_mag_max" : parseInt(xd_mag_max) || 10,
            "date_start" : date_start || "",
            "date_end" : date_end || "",
            "sort" : sort || "date",
            "reverse" : reverse === "true"
        };

        res
        .status(200)
        .render("search/layout", {
            "file" : "query",
            "title" : "퍼즐 검색",
            "form" : query,
            ...calcPage(PuzzleDAO.getPuzzleByQuery(query).sort(sort, reverse === "true").puzzles, parseInt(page) || 1)
        });
    } catch (err) {
        res.status(500).redirect("/error");
    }
});

export {
    router
};
