import {readFileSync, writeFileSync} from "fs";
import {join} from "path";

const readJSON = function (file) {
    return JSON.parse(readFileSync(join("./data", file), "utf8"));
};
const writeJSON = function (file, data) {
    writeFileSync(join("./data", file), JSON.stringify(data), "utf8");
};

export {
    readJSON,
    writeJSON
};
