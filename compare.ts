import { compareTwoTexts } from "./compareTwoText";

const { PythonShell } = require("python-shell");

let options = {
    mode: "text",
    pythonOptions: ["-u"],
    scriptPath: "",
    args: ["value1", "value2"],
};

const pythonRunning = (dataPath: string) => {
    options.args = [dataPath];
    console.log("Running Python script...");
    PythonShell.run("py_compareTwoText.py", options).then((result: any) => {
        console.log(result[0]);
    }).then(() => {
        console.log("Python script executed successfully!");
    }).catch((err: any) => {
        console.error(err);
    });
};

const TSRunning = (dataPath: string) => {
    console.log("Running TS script...");
    const fs = require("fs");
    const { parse } = require("csv-parse");
    const { stringify } = require("csv-stringify");
    // Store the result to a new CSV file
    const ws = fs.createWriteStream("./output.csv");
    const writeCSV = stringify({ header: true });

    // Read CSV file then create new column to store the result of comparing two texts
    fs.readFile(dataPath, (err: any, data: any) => {
        if (err) {
            console.error(err);
            return;
        }
        parse(data, { columns: true }, (err: any, records: any) => {
            if (err) {
                console.error(err);
                return;
            }
            records.forEach((record: any) => {
                record["TS code similarity"] = compareTwoTexts({
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
}

const { performance } = require("perf_hooks");
const start = performance.now();
TSRunning("./nametest.csv");
const end = performance.now();
console.log(`Time to run TS script: ${end - start}ms`); // 25ms

setTimeout(() => {
    pythonRunning("./output.csv");
}, 1000);                                               // 7.4s