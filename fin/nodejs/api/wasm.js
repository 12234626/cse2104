import createModule from "./wasm/nonogram-solver.js";

const instance = await createModule();
let xd = 0, logic = false;

instance._setWrap(instance.addFunction(function () {}, "v"));
instance._setInspect(instance.addFunction(function (vec, vi, inference) {
    ++xd;
    if (inference) logic = true;
}, "viii"));

const solve = function (clue) {
    const input = instance._getInputPtr();

    instance.HEAP16.set(clue, input >> 1);
    xd = 0;
    logic = false;

    if (instance._solve()) {
        const output = instance._getOutputPtr(), view = instance.HEAP16.subarray(output >> 1, (output >> 1) + clue[0] * clue[1]);
        const result = [];
    
        for (let r = 0; r < clue[0]; r++) {
            result.push([]);
            for (let c = 0; c < clue[1]; c++) result[result.length - 1].push(view[r * clue[1] + c]);
        }
    
        return {
            "result" : result,
            "xd" : xd,
            "logic": logic
        };
    }
    return {
        "result" : null
    };
};

export {
    solve
};
