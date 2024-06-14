import {readJSON, writeJSON} from "./json.js";

const appendLog = function (type, content) {
    const logs = readJSON("logs.json");
    const log = {
        "type" : type,
        "content" : content
    };
    
    logs.push(log);
    writeJSON("logs.json", logs);
    console.log(log);
};

export {
    appendLog
};
