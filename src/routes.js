import Static from "./services/static.js";
import AddressAuth from "./services/auth.js";
import config from "./config.js"

const {
	location,
	pages: {
		homeHTML
	},
	constants: {
		CONTENT_TYPE
	}
} = config;

export default class Router {
  constructor() {
    this.authenticator = new AddressAuth();
  }

  async auth(request, response) {
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
    const { method, url } = request;

    // Redirecionar pra home
    if(url === "/" && method === "GET") {
      response.writeHead(302, {
        "Location": location.home
      })
      return response.end();
    }

    // Retorna a página home
    if (url === "/home" && method === "GET") {
      response.setHeader("Access-Control-Allow-Origin", "*");
      return this.default.apply(this, [request, response]);
    }

    // Direciona pra rota de autenticação da metamask
    if (url === "/auth" && method === "POST")) {
      return await this.auth.apply(this, [request, response]);
    }

    // Not Found
    response.writeHead(404);
    return response.end();
  }
}
