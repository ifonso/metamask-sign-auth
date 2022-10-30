import { logger } from "./utils/utils.js";
import server from "./server.js";
import config from "./config.js";

server.listen(config.PORT)
  .on("listening", () => logger.info(`Server running at [${config.PORT}]`))