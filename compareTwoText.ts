import { compareTwoStrings } from "string-similarity";

const stripUnicode = (text: string): string => {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const sanitizeString = (text: string): string => {
  if (!text) return "";
  return text.replace(/[^\w\s]/g, "");
};

const cached = new Map() as Map<string, number>;

export const compareTwoTexts = ({
  text1,
  text2,
  options,
}: {
  text1: string;
  text2: string;
  options?: { ignoreUnicode: boolean; ignoreCase: boolean; sanitize?: boolean };
}): number => {
  if (text1 === text2) {
    return 1;
  }
  const cachedKey = JSON.stringify([text1, text2, options?.ignoreUnicode, options?.ignoreCase, options?.sanitize]);
  let score = cached.get(cachedKey);
  if (typeof score === "undefined") {
    let string1 = text1;
    let string2 = text2;

    if (options?.ignoreUnicode) {
      string1 = stripUnicode(string1).replace(".", "");
      string2 = stripUnicode(string2).replace(".", "");
    }

    if (options?.ignoreCase) {
      string1 = string1.toLowerCase();
      string2 = string2.toLowerCase();
    }

    if (options?.sanitize) {
      string1 = sanitizeString(string1);
      string2 = sanitizeString(string2);
    }

    score = compareTwoStrings(string1, string2);
    cached.set(cachedKey, score);
  }

  return score;
};