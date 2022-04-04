import Static from "./services/static.js";
import AddressAuth from "./services/auth.js";

export default class Router {
  constructor() {
    this.authenticator = new AddressAuth();
  }

  async auth(request, response) {
    /**
     *  @TODO :Pôr tudo isso nos controllers
     **/

    let data = "";

    response.writeHead(200, { "Content-type": "application/json" });

    request.on("data", (chunck) => {
      data += chunck;
    });

    request.on("end", () => {
      const user = {
        address: null,
        challenge: null,
        signature: null,
      };

      Object.assign(user, JSON.parse(data));

      console.log("USUÁRIO: ", user);

      if (!user.address) {
        return response.end(
          JSON.stringify({
            error: true,
            message: "no_address",
          })
        );
      }

      const result = this.authenticator.auth(
        user.address,
        user.challenge,
        user.signature
      );

      console.log("RESULTADO: ", result);

      return response.end(JSON.stringify(result));
    });
  }

  async default(request, response) {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(Static.getIndex());
    response.end();
  }

  async handler(request, response) {
    // Direciona pros métodos da rota default
    if (request.url === "/") {
      response.setHeader("Access-Control-Allow-Origin", "*");
      const method = this[request.method.toLowerCase()] || this.default;
      return method.apply(this, [request, response]);
    }

    // Direciona pros métodos da rota auth
    if ((request.url === "/auth") & (request.method.toLowerCase() === "post")) {
      return await this.auth.apply(this, [request, response]);
    }

    // Entrega a página default
    return this.default.apply(this, [request, response]);
  }
}
