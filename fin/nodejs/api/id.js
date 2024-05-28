import {readJSON, writeJSON} from "./json.js";

const getID = function() {
    const id = readJSON("id.json") + 1;

    writeJSON("id.json", id);

    return id;
};

export {
    getID
};