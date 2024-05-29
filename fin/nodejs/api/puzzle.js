import {readJSON, writeJSON} from "./json.js";
import {filterAuthor, filterPassword, filterTitle} from "./text.js";
import {appendLog} from "./log.js";

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
const compareBy = function (method, reverse) {
    return (a, b) => (reverse ? -1 : 1) * selectSortMethod(method)(a, b);
};
const makeClue = function (row, col, table) {
    const clue = [row, col];

    for (let k = 2, l = 0;;) {
        for (let i = 0; i < row; ++i, k += clue[k] + 1, l = 0) {
            clue.push(0);
            for (let j = 0; j < col; ++j) {
                if (table[i][j] === 2) ++l;
                else if (l) {
                    temp.push(l);
                    l = 0;
                }
            }
            if (l) temp.push(l);
            if (!clue[k]) {
                clue[k] = 1;
                clue.push(0);
            };
        }
        for (let j = 0; j < col; ++j, k += clue[k] + 1, l = 0) {
            clue.push(0);
            for (let i = 0; i < row; ++i) {
                if (table[i][j] === 2) ++l;
                else if (l) {
                    temp.push(l);
                    l = 0;
                }
            }
            if (l) temp.push(l);
            if (!clue[k]) {
                clue[k] = 1;
                clue.push(0);
            };
        }

        return clue;
    }
    return [];
};
const makePuzzle = function (id, author, password, title, clue, xd, logic) {
    const max_clue_size = [0, 0];

    for (let k = 2; k < clue.length;) {
        for (let i = 0; i < clue[0]; ++i, k += clue[k] + 1) max_clue_size[0] = Math.max(max_clue_size[0], clue[k]);
        for (let j = 0; j < clue[1]; ++j, k += clue[k] + 1) max_clue_size[1] = Math.max(max_clue_size[1], clue[k]);
    }

    return {
        "id" : id,
        "author" : filterAuthor(author),
        "password" : filterPassword(password),
        "title" : filterTitle(title),
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
    appendLog("CREATE_PUZZLE", {
        "id" : puzzle["id"],
        "author" : puzzle["author"],
        "title" : puzzle["title"],
        "date" : puzzle["date"],
    });
};
const deletePuzzle = function (id) {
    const puzzles = readJSON("puzzles.json");
    const puzzle_index = puzzles.findIndex(e => e["id"] === id)

    if (puzzle_index !== -1) {
        writeJSON("puzzles.json", puzzles.filter(e => e["id"] !== id));
        appendLog("DELETE_PUZZLE", {
            "id" : puzzles[puzzle_index]["id"],
            "author" : puzzles[puzzle_index]["author"],
            "title" : puzzles[puzzle_index]["title"],
            "date" : puzzles[puzzle_index]["date"],
        });

        return true;
    }
    return false;
};

export {
    getPuzzleByID,
    getPuzzleByQuery,
    compareBy,
    makeClue,
    makePuzzle,
    appendPuzzle,
    deletePuzzle
};
