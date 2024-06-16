import {readFileSync, writeFileSync} from "fs";
import {join} from "path";

const readJSON = function (file) {
    return JSON.parse(readFileSync(join("./data", file), "utf8"));
};
const writeJSON = function (file, data) {
    writeFileSync(join("./data", file), JSON.stringify(data), "utf8");
};
const filterAuthor = function (text) {
    return text.replace(/[^a-zA-Z가-힣\s]/g, "").replace(/\s/g, "").substring(0, 10) || "익명";
};
const filterPassword = function (text) {
    return text.replace(/\s+/g, "");
}
function filterTitle(text) {
    return text.replace(/[^a-zA-Z가-힣0-9\s]/g, "").trim().replace(/\s+/g, " ").substring(0, 20).trim() || "제목 없음";
};
const calcPage = function (puzzles, page) {
    const max_count_in_one_page = 10, max_page = Math.ceil(puzzles.length / max_count_in_one_page);

    return {
        "puzzles" : puzzles.slice(max_count_in_one_page * (page - 1), Math.min(puzzles.length, max_count_in_one_page * page)),
        "page" : page,
        "max_page" : max_page
    };
};

export {
    readJSON,
    writeJSON,
    filterAuthor,
    filterPassword,
    filterTitle,
    calcPage
};
