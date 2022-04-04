import http from "http";
import Router from "./routes.js";

const PORT = 8000;
const router = new Router();

const server = http.createServer(await router.handler.bind(router));

const startServer = () => {
  const { address, port } = server.address();
  console.log(`Server running at: [http://${address}:${port}]`);
};

server.listen(PORT, startServer);
