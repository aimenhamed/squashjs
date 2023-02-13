import {
  createComponent,
  createApp,
  Request,
  Response,
  NextFunction,
} from "./src";

// Runs Express server for 5 seconds serving a route on /api/v1/yeet at port 3000
class YeetService {
  getFood() {
    return "food";
  }

  getError() {
    throw new Error("Yeet error");
  }
}
const service = new YeetService();

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Error) {
    return res.status(500).json(err.message);
  }
  return res.status(500).json("Something went wrong");
};

export const yeetMiddleware =
  (message: string) => (req: Request, res: Response, next: NextFunction) => {
    console.log(message);
    next();
  };

const yeetComponent = createComponent({
  prefix: "/api/v1",
  routes: [
    {
      method: "GET",
      path: "/yeet",
      middlewares: [
        yeetMiddleware("Yeet middleware called!"),
        yeetMiddleware("Yeet middleware called again!"),
      ],
      handler: (_req, res) => res.json(service.getFood()),
    },
    {
      method: "GET",
      path: "/error",
      handler: (_req, _res) => service.getError(),
    },
  ],
});

const app = createApp({
  port: 3000,
  components: [yeetComponent],
  middlewares: [errorHandler],
});
app.run();

setTimeout(() => app.stop(), 5000);
