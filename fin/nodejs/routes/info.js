import express from "express";

const router = express.Router();

router.get("/", function (req, res) {
    try {
        res
        .status(200)
        .render("info", {
            "title" : "정보"
        });
    } catch (err) {
        res.status(500).redirect("/error");
    }
});

export {
    router
};
