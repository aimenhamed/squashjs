import * as http from "http";
import express, {
  Express,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { SquashComponent, createComponent } from "./component/component";

type Middleware =
  | RequestHandler
  | ((
      err: any,
      req: Request,
      res: Response,
      next: NextFunction
    ) => Response<any, Record<string, any>>);

type AppOptions = {
  port: number;
  components: SquashComponent[];
  middlewares?: Middleware[];
};

class SquashServer {
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

  use(handler: Middleware) {
    this.ex.use(handler);
  }
}

function setupExpress(): Express {
  return express()
    .use(express.json())
    .use(express.urlencoded({ extended: true }));
}

function createApp({ port, components, middlewares }: AppOptions) {
  const ex = setupExpress();

  for (const component of components) {
    ex.use(component.getPrefix(), component.getRouter());
  }

  ex.use((_req: Request, res: Response) =>
    res.status(404).json({
      errorCode: 404,
      errorMessage: "Not found",
    })
  );

  if (middlewares) {
    for (const middleware of middlewares) {
      ex.use(middleware);
    }
  }

  return new SquashServer(port, ex);
}

export { createApp, createComponent };
export type {
  AppOptions,
  Middleware,
  SquashComponent,
  Request,
  Response,
  NextFunction,
  RequestHandler,
};
