import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Config
const currentDir = dirname(fileURLToPath(import.meta.url));
const root = join(currentDir, "../");

const PORT = process.env.PORT || 5500

// Static
const publicDir = join(root, "public")

export default {
  PORT,
  dirs: {
    root,
    publicDir
  },
  pages: {
    homeHTML: 'index.html'
  },
  location: {
    home: '/home'
  },
  constants: {
    CONTENT_TYPE: {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
    }
  }
}