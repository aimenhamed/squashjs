import { RequestHandler, Router } from "express";
import { Middleware } from "../index";

type Route = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  middlewares?: Middleware[];
  handler: RequestHandler;
};

type SquashComponentOptions = {
  prefix: string;
  routes: Route[];
};

type SquashComponent = {
  getPrefix: () => string;
  getRouter: () => Router;
};

function createComponent({
  prefix,
  routes,
}: SquashComponentOptions): SquashComponent {
  const router = Router();
  for (const route of routes) {
    if (route.middlewares && route.middlewares.length > 0) {
      (router as any)[route.method.toLowerCase()](
        route.path,
        ...route.middlewares,
        route.handler
      );
    } else {
      (router as any)[route.method.toLowerCase()](route.path, route.handler);
    }
  }

  return {
    getPrefix: () => prefix,
    getRouter: () => router,
  };
}

export { SquashComponent, createComponent };
