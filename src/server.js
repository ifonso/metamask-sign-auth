import { createServer } from "http";

import Router from "./routes.js";
import Controller from "./controllers/controllers.js";
import AddressAuth from "./services/WalletAuthService.js";

const router = new Router(
  new Controller(),
  new AddressAuth()
);

const server = createServer(await router.handler.bind(router));

export default server;