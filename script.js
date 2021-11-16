const fs = require("fs");
const crypto = require("crypto");
const assert = require("assert");

const EMPTY_FILTER = (e) => e !== "";

const file = fs.readFileSync("./english.txt", "utf-8");

const HASH = "2f5eed53a4727b4bf8880d8f3f199efc90e58503646d9ff8eff3a2ed3b24dbda";
const hash = crypto.createHash("sha256").update(file).digest("hex");

assert.strictEqual(HASH, hash);

const words = file.split("\n").filter(EMPTY_FILTER);

assert.strictEqual(words.length, 2048);

const maxLength = Math.max(...words.map((w) => w.length));

let explainations = "# bip-0039 English wordlist\n";
explainations += "### Important note: index starts from 1, other fields from 0\n";

function gen(withPadStart = false) {
  let str = explainations + "\n";
  str += "| index | hex | binary | bullets | word |\n";
  str += "| ----- | --- | ------ | ------- | ---- |\n";

  for (let i = 0; i < words.length; i++) {
    const word = words[i].padEnd(maxLength, " ");

    const index = (i + 1).toString().padStart(4, "0");

    let binary = i.toString(2);
    if (withPadStart) {
      binary = binary.padStart(11, "0");
    }

    const bullets = binary
      .split("")
      .map((e) => (e === "0" ? "○" : "●"))
      .join("");

    let hex = i.toString(16);
    if (withPadStart) {
      hex = hex.padStart(3, "0");
    }

    str += "| " + [index, hex, binary, bullets, word].join(" | ") + " |\n";
  }

  return str;
}

fs.writeFileSync("./words.md", gen());
fs.writeFileSync("./words-with-pad-start.md", gen(true));
