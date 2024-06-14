import {readJSON, writeJSON} from "./json.js";
import {filterAuthor, filterPassword, filterTitle} from "./text.js";
import {solve} from "../api/wasm.js";
import {appendLog} from "./log.js";

class Puzzle {
    constructor(author, password, title, clue, xd, logic) {
        const max_clue_size = [0, 0];
    
        for (let k = 2; k < clue.length;) {
            for (let i = 0; i < clue[0]; ++i, k += clue[k] + 1) max_clue_size[0] = Math.max(max_clue_size[0], clue[k]);
            for (let j = 0; j < clue[1]; ++j, k += clue[k] + 1) max_clue_size[1] = Math.max(max_clue_size[1], clue[k]);
        }

        this.author = filterAuthor(author);
        this.password = filterPassword(password);
        this.title = filterTitle(title);
        this.clue = clue;
        this.max_clue_size = max_clue_size;
        this.row = clue[0];
        this.col = clue[1];
        this.xd = xd;
        this.xd_mag = xd / (clue[0] + clue[1]);
        this.logic = logic;
    }
    static makeClue(row, col, table) {
        const clue = [row, col];
    
        for (let k = 2, l = 0;;) {
            for (let i = 0; i < row; ++i, k += clue[k] + 1, l = 0) {
                clue.push(0);
                for (let j = 0; j < col; ++j) {
                    if (table[i][j] === 2) ++l;
                    else if (l) {
                        clue[k]++;
                        clue.push(l);
                        l = 0;
                    }
                }
                if (l) {
                    clue[k]++;
                    clue.push(l);
                }
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
                        clue[k]++;
                        clue.push(l);
                        l = 0;
                    }
                }
                if (l) {
                    clue[k]++;
                    clue.push(l);
                }
                if (!clue[k]) {
                    clue[k] = 1;
                    clue.push(0);
                };
            }

            return clue;
        }
        return null;
    }
    static makePuzzleWithTable({author, password, title, row, col, table}) {
        const clue = Puzzle.makeClue(row, col, table);
        const {result, xd, logic} = solve(clue);

        return result ? new Puzzle(author, password, title, clue, xd, logic) : null;
    }
    static makePuzzleWithObj({id, author, password, title, clue, xd, logic, date}) {
        const puzzle = new Puzzle(author, password, title, clue, xd, logic, id);

        puzzle.id = id;
        puzzle.date = date;

        return puzzle;
    }
    static compareClueAndTable({clue, table}) {
        const {result} = solve(clue);
        let flag = true;
    
        for (let i = 0; i < clue[0]; ++i) for (let j = 0; j < clue[1]; ++j) if ((result[i][j] === 2) !== (table[i][j] === 2)) flag = false;

        return flag;
    }

    matchByID(id) {
        return this.id === id;
    }
    matchByQuery({col_min, col_max, row_min, row_max, logic_false, logic_true, xd_min, xd_max, xd_mag_min, xd_mag_max, date_start, date_end}) {
        return this.col >= col_min && this.col <= col_max &&
        this.row >= row_min && this.row <= row_max &&
        (!this.logic && logic_false || this.logic && logic_true) &&
        this.xd >= xd_min && this.xd <= xd_max &&
        this.xd_mag >= xd_mag_min && this.xd_mag <= xd_mag_max &&
        (!date_start || new Date(this.date) >= new Date(new Date(date_start).getTime() - 32400000)) && (!date_end || new Date(this.date) < new Date(new Date(date_end).getTime() + 54000000));
    }
    compareByMethod(other, method) {
        switch (method) {
        case "size": return this.row * this.col - other.row * other.col;
        case "xd": return this.xd - other.xd;
        case "xd_mag": return this.xd_mag - other.xd_mag;
        case "random": return Math.random() - 0.5;
        default: return new Date(this.date) - new Date(other.date);
        }
    }
    compare(other, method, reverse) {
        return (reverse ? -1 : 1) * this.compareByMethod(other, method);
    }
    getObj() {
        return {
            "id" : this.id,
            "author" : this.author,
            "password" : this.password,
            "title" : this.title,
            "clue" : this.clue,
            "max_clue_size" : this.max_clue_size,
            "row" : this.row,
            "col" : this.col,
            "xd" : this.xd,
            "xd_mag" : this.xd_mag,
            "logic" : this.logic,
            "date" : this.date
        };
    }
}
class PuzzleDAO {
    static generateID() {
        const id = readJSON("id.json") + 1;
    
        writeJSON("id.json", id);
    
        return id;
    }
    static getPuzzles() {
        return readJSON("puzzles.json").map(e => Puzzle.makePuzzleWithObj(e));
    }
    static getPuzzleByID(id) {
        const puzzles = PuzzleDAO.getPuzzles();
        const result = [];
    
        for (let e of puzzles) if (e.matchByID(id)) result.push(e);
    
        if (result.length) return result[0];
        return null;
    }
    static getPuzzleByQuery = function (query) {
        const puzzles = PuzzleDAO.getPuzzles();
        const result = [];
    
        for (let e of puzzles) if (e.matchByQuery(query)) result.push(e);
    
        return result;
    }
    static sortBy(puzzles, method, reverse) {
        return puzzles.sort((a, b) => a.compare(b, method, reverse));
    }
    static createPuzzle(puzzle) {
        const puzzles = PuzzleDAO.getPuzzles();
    
        puzzle.id = PuzzleDAO.generateID();
        puzzle.date = new Date();
        puzzles.push(puzzle.getObj());
        writeJSON("puzzles.json", puzzles);
        appendLog("PUZZLE_CREATED", {
            "id" : puzzle.id,
            "author" : puzzle.author,
            "title" : puzzle.title,
            "date" : puzzle.date,
        });
    }
    static deletePuzzleByID(id) {
        const puzzles = PuzzleDAO.getPuzzles();
        const puzzle_index = puzzles.findIndex(e => e.matchByID(id));

        if (puzzle_index !== -1) {
            writeJSON("puzzles.json", puzzles.filter(e => !e.matchByID(id)));
            appendLog("PUZZLE_DELETED", {
                "id" : puzzles[puzzle_index]["id"],
                "author" : puzzles[puzzle_index]["author"],
                "title" : puzzles[puzzle_index]["title"],
                "date" : puzzles[puzzle_index]["date"],
            });
    
            return true;
        }
        return false;
    }
}

export {
    Puzzle,
    PuzzleDAO
};
