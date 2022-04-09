import { extname, join } from "path";
import config from "../config.js";
import fsPromise from "fs/promises";
import fs from "fs";

class streamService {
  createFileStream(filename) {
    return fs.createReadStream(filename);
  }

  async getFileInfo(file) {
    const fullPath = join(config.dirs.publicDir, file);
    await fsPromise.access(fullPath);

    return {
      name: fullPath,
      type: extname(fullPath)
    }
  }

  async getFileStream(file) {
    const { name, type } = await this.getFileInfo(file);
    
    return {
      stream: this.createFileStream(name),
      type
    }
  }
}

export default streamService;