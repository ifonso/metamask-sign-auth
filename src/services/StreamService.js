import { extname, join } from "path";
import fsPromise from "fs/promises";
import fs from "fs";

import config from "../config.js";

class streamService {
  createFileStream(filename) {
    return fs.createReadStream(filename);
  }

  // (file name) -> Return file path & type
  async getFileInfo(file) {
    const fullPath = join(config.dirs.publicDir, file);
    // Check permissions
    await fsPromise.access(fullPath);

    return {
      name: fullPath,
      type: extname(fullPath)
    }
  }

  // (file name) -> Return file type & redable stream
  async getFileStream(file) {
    const { name, type } = await this.getFileInfo(file);
    
    return {
      stream: this.createFileStream(name),
      type
    }
  }
}

export default streamService;