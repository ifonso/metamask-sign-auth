import { createServer } from "http";
import Router from "./routes.js";

const router = new Router();
const server = createServer(await router.handler.bind(router));

export default server;