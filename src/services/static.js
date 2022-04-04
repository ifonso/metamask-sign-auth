import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

export default class Static {
  static getIndex() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const staticPath = resolve(__dirname, "../", "public", "index.html")
    const data = fs.readFileSync(staticPath, {
      encoding: "utf-8",
      flag: "r",
    });

    return data;
  }
}
