import {readJSON, writeJSON} from "./json.js";

const appendLog = function (type, log) {
    const logs = readJSON("logs.json");

    logs.push({
        "type" : type,
        "log" : log
    });
    writeJSON("logs.json", logs);
};

export {
    appendLog
};
