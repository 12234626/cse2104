import express from "express";
import {readJSON} from "../api/json.js";

const router = express.Router();

router.get("/", function (req, res){
    res.render("info", {
        "title" : "정보",
        "test" : readJSON("puzzles.json")
    });
});

export {
    router
};
