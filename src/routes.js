import config from "./config.js"
import Controller from "./controllers/controllers.js";
import AddressAuth from "./services/WalletAuthService.js";

const {
	location,
	pages: { homeHTML },
	constants: { CONTENT_TYPE }
} = config;

class Router {
  constructor() {
    this.controller = new Controller();
    this.authenticator = new AddressAuth();
  }

  // Auth route
  async auth(request, response) {
    let data;

    request.on("data", (chunck) => {
      data = chunck.toString();
    });

    request.on("end", () => {
      console.log(data)
      // address - signature - challenge
      const user = JSON.parse(data);

      // Check if address was given
      if (!user.address) {
        response.writeHead(400);
        
        return response.end(
          JSON.stringify({
            error: true,
            message: "no_address",
          })
        );
      }

      // Passing data to auth
      const result = this.authenticator.auth(
        user.address,
        user.challenge,
        user.signature
      );
      
      if (result.name !== "approved") {
        response.writeHead(403, { "Content-type": "application/json" });  
      }

      response.writeHead(200, { "Content-type": "application/json" });
      return response.end(JSON.stringify(result));
    });
  }
  
  // Home
  async default(_, response) {
    const { stream } = await this.controller.getFileStream(homeHTML);
    response.writeHead(200, {
      "Content-Type": CONTENT_TYPE[".html"]
    });

    return stream.pipe(response);
  }

  // Static files
  async static(request, response) {
    const {
      stream,
      type
    } = await this.controller.getFileStream(request.url);

    if(CONTENT_TYPE[type]) {
      response.writeHead(200, {
        "Content-Type": CONTENT_TYPE[type]
      })
    }

    return stream.pipe(response);
  }

  // Routes handler
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
    if (url === "/auth" && method === "POST") {
      return await this.auth.apply(this, [request, response]);
    }

    // Direciona pra static
    if (method === "GET") {
      return await this.static.apply(this, [request, response]);
    }

    // Not Found
    response.writeHead(404);
    return response.end();
  }
}

export default Router;