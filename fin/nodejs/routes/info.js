import express from "express";

const router = express.Router();

router.get("/", function (req, res){
    res.render("info", {
        "title" : "정보"
    });
});

export {
    router
};
