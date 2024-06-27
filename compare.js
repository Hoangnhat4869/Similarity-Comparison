"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compareTwoText_1 = require("./compareTwoText");
var PythonShell = require("python-shell").PythonShell;
var options = {
    mode: "text",
    pythonOptions: ["-u"],
    scriptPath: "",
    args: ["value1", "value2"],
};
var pythonRunning = function (dataPath) {
    options.args = [dataPath];
    console.log("Running Python script...");
    PythonShell.run("py_compareTwoText.py", options).then(function (result) {
        console.log(result[0]);
    }).then(function () {
        console.log("Python script executed successfully!");
    }).catch(function (err) {
        console.error(err);
    });
};
var TSRunning = function (dataPath) {
    console.log("Running TS script...");
    var fs = require("fs");
    var parse = require("csv-parse").parse;
    var stringify = require("csv-stringify").stringify;
    // Store the result to a new CSV file
    var ws = fs.createWriteStream("./output.csv");
    var writeCSV = stringify({ header: true });
    // Read CSV file then create new column to store the result of comparing two texts
    fs.readFile(dataPath, function (err, data) {
        if (err) {
            console.error(err);
            return;
        }
        parse(data, { columns: true }, function (err, records) {
            if (err) {
                console.error(err);
                return;
            }
            records.forEach(function (record) {
                record["TS code similarity"] = (0, compareTwoText_1.compareTwoTexts)({
                    text1: record["ltable_item_name"],
                    text2: record["rtable_item_name"],
                    options: { ignoreUnicode: true, ignoreCase: true, sanitize: true },
                });
                writeCSV.write(record);
            });
            writeCSV.pipe(ws);
            console.log("TS script executed successfully!");
        });
    });
};
var performance = require("perf_hooks").performance;
var start = performance.now();
TSRunning("./nametest.csv");
var end = performance.now();
console.log("Time to run TS script: ".concat(end - start, "ms")); // 13ms
setTimeout(function () {
    pythonRunning("./output.csv");
}, 1000); // 880ms
