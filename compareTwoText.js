"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareTwoTexts = void 0;
var string_similarity_1 = require("string-similarity");
var stripUnicode = function (text) {
    if (!text)
        return "";
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
};
var sanitizeString = function (text) {
    if (!text)
        return "";
    return text.replace(/[^\w\s]/g, "");
};
var cached = new Map();
var compareTwoTexts = function (_a) {
    var text1 = _a.text1, text2 = _a.text2, options = _a.options;
    if (text1 === text2) {
        return 1;
    }
    var cachedKey = JSON.stringify([text1, text2, options === null || options === void 0 ? void 0 : options.ignoreUnicode, options === null || options === void 0 ? void 0 : options.ignoreCase, options === null || options === void 0 ? void 0 : options.sanitize]);
    var score = cached.get(cachedKey);
    if (typeof score === "undefined") {
        var string1 = text1;
        var string2 = text2;
        if (options === null || options === void 0 ? void 0 : options.ignoreUnicode) {
            string1 = stripUnicode(string1).replace(".", "");
            string2 = stripUnicode(string2).replace(".", "");
        }
        if (options === null || options === void 0 ? void 0 : options.ignoreCase) {
            string1 = string1.toLowerCase();
            string2 = string2.toLowerCase();
        }
        if (options === null || options === void 0 ? void 0 : options.sanitize) {
            string1 = sanitizeString(string1);
            string2 = sanitizeString(string2);
        }
        score = (0, string_similarity_1.compareTwoStrings)(string1, string2);
        cached.set(cachedKey, score);
    }
    return score;
};
exports.compareTwoTexts = compareTwoTexts;
