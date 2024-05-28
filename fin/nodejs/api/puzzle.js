import {readJSON, writeJSON} from "./json.js";
import {refineAuthor, refinePassword, refineTitle} from "./text.js";

const getPuzzleByID = function (id) {
    const result = [];

    for (let e of readJSON("puzzles.json")) if (e["id"] === id) result.push(e);

    if (result.length) return result[0];
};
const getPuzzleByQuery = function (query) {
    const {col_min, col_max, row_min, row_max, logic_false, logic_true, xd_min, xd_max, xd_mag_min, xd_mag_max, date_start, date_end} = query;
    const result = [];

    for (let e of readJSON("puzzles.json")) {
        if (e["col"] >= col_min && e["col"] <= col_max &&
            e["row"] >= row_min && e["row"] <= row_max &&
            (e["logic"] === "단일" && logic_false || e["logic"] === "선택" && logic_true) &&
            e["xd"] >= xd_min && e["xd"] <= xd_max &&
            e["xd_mag"] >= xd_mag_min && e["xd_mag"] <= xd_mag_max &&
            (!date_start || new Date(e["date"]) >= new Date(new Date(date_start).getTime() - 32400000)) && (!date_end || new Date(e["date"]) < new Date(new Date(date_end).getTime() + 54000000))
        ) result.push(e);
    }

    return result;
};
const selectSortMethod = function (method) {
    switch (method) {
    case "size": return (a, b) => parseInt(a["row"]) * parseInt(a["col"]) - parseInt(b["row"]) * parseInt(b["col"]);
    case "xd": return (a, b) => parseInt(a["xd"]) - parseInt(b["xd"]);
    case "xd_mag": return (a, b) => parseInt(a["xd_mag"]) - parseInt(b["xd_mag"]);
    case "random": return (a, b) => Math.random() - 0.5;
    default: return (a, b) => new Date(a["date"]) - new Date(b["date"]);
    }
};
const sortBy = function (method, reverse) {
    return (a, b) => (reverse ? -1 : 1) * selectSortMethod(method)(a, b);
};
const makePuzzle = function (id, author, password, title, clue, xd, logic) {
    const max_clue_size = [0, 0];

    for (let k = 2; k < clue.length;) {
        for (let i = 0; i < clue[0]; ++i, k += clue[k] + 1) max_clue_size[0] = Math.max(max_clue_size[0], clue[k]);
        for (let j = 0; j < clue[1]; ++j, k += clue[k] + 1) max_clue_size[1] = Math.max(max_clue_size[1], clue[k]);
    }

    return {
        "id" : id,
        "author" : refineAuthor(author),
        "password" : refinePassword(password),
        "title" : refineTitle(title),
        "clue" : clue,
        "max_clue_size" : max_clue_size,
        "row" : clue[0],
        "col" : clue[1],
        "xd" : xd,
        "xd_mag" : xd / (clue[0] + clue[1]),
        "logic" : logic ? "선택" : "단일",
        "date" : new Date()
    };
};
const appendPuzzle = function (puzzle) {
    const puzzles = readJSON("puzzles.json");

    puzzles.push(puzzle);
    writeJSON("puzzles.json", puzzles);
};
const deletePuzzle = function (id) {
    const puzzles = readJSON("puzzles.json");

    if (puzzles.findIndex(e => e["id"] === id) !== -1) {
        writeJSON("puzzles.json", puzzles.filter(e => e["id"] !== id));

        return true;
    }
    return false;
};

export {
    getPuzzleByID,
    getPuzzleByQuery,
    sortBy,
    makePuzzle,
    appendPuzzle,
    deletePuzzle
};
