import * as http from "http";
import express, { Express, Request, RequestHandler, Response } from "express";
import { Controller, createController } from "./controller/controller";

type AppObject = {
  port: number;
  controllers: Controller[];
  middlewares?: RequestHandler[];
};

function setupExpress(middlewares: RequestHandler[]): Express {
  const ex = express();
  for (const middleware of middlewares) {
    ex.use(middleware);
  }

  return ex.use(express.json()).use(express.urlencoded({ extended: true }));
}

class Server {
  private server: http.Server | undefined;
  private ex: Express;
  private port: number;

  constructor(port: number, ex: Express) {
    this.port = port;
    this.ex = ex;
  }

  run() {
    this.server = this.ex.listen(this.port, () =>
      console.log("Listening on " + this.port + "...")
    );
  }

  stop() {
    if (this.server) {
      this.server.close();
    } else {
      throw new Error("Server not started.");
    }
  }
}

function createApp({ port, controllers, middlewares }: AppObject) {
  const ex = setupExpress(middlewares ?? []);

  for (const controller of controllers) {
    ex.use(controller.getPrefix(), controller.getRouter());
  }

  ex.use((_req: Request, res: Response) => {
    res.status(404).json({
      errorCode: 404,
      errorMessage: "Not found",
    });
  });

  return new Server(port, ex);
}

export { createApp, createController };
