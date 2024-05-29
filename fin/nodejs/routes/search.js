import express from "express";
import {readJSON} from "../api/json.js";
import {getPuzzleByQuery, compareBy} from "../api/puzzle.js";
import {calcPage} from "../api/page.js";

const router = express.Router();

router
.use(express.static("./public"));

router
.get("/all", function (req, res) {
    const {page} = req.query;
    
    res.render("search/layout", {
        "file" : "all",
        "title" : "전체 퍼즐",
        "form" : {},
        ...calcPage(readJSON("puzzles.json").sort(compareBy("date", true)), parseInt(page) || 1)
    });
})
.get("/query", function (req, res) {
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

    res.render("search/layout", {
        "file" : "query",
        "title" : "퍼즐 검색",
        "form" : query,
        ...calcPage(getPuzzleByQuery(query).sort(compareBy(sort, reverse === "true")), parseInt(page) || 1)
    });
});

export {
    router
};
