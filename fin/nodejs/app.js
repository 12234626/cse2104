import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import {router as main_router} from "./routes/main.js";
import {router as search_router} from "./routes/search.js";
import {router as puzzle_router} from "./routes/puzzle.js";
import {router as info_router} from "./routes/info.js";

const app = express();
const port = process.env.PORT || 3000;

app
.set("view engine", "ejs")
.set("views", "./views");
// app.set("layout extractScripts", true);

app
.use(express.json())
// app.use(express.urlencoded({extended : false}))
.use(express.static("./public"))
.use(expressEjsLayouts)
// .use(function (req, res, next) {
//     res.header("Cross-Origin-Embedder-Policy", "credentialless");
//     res.header("Cross-Origin-Opener-Policy", "same-origin");
//     next();
// })
.use("/", main_router)
.use("/search", search_router)
.use("/puzzle", puzzle_router)
.use("/info", info_router);

app.get("*", function (req, res) {
    res.render("error", {
        "title" : "오류 페이지"
    });
});

app.listen(port, function () {
    console.log(`http://localhost:${port}`);
});
