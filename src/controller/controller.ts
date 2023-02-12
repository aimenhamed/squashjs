import { RequestHandler, Router } from "express";

type Route = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  handler: RequestHandler;
};

type ControllerOptions = {
  prefix: string;
  routes: Route[];
};

type Controller = {
  getPrefix: () => string;
  getRouter: () => Router;
};

function createController({ prefix, routes }: ControllerOptions): Controller {
  const router = Router();
  for (const route of routes) {
    switch (route.method) {
      case "GET":
        router.get(route.path, route.handler);
        break;
      case "POST":
        router.post(route.path, route.handler);
        break;
      case "PUT":
        router.put(route.path, route.handler);
        break;
      case "PATCH":
        router.patch(route.path, route.handler);
        break;
      case "DELETE":
        router.delete(route.path, route.handler);
        break;
      default:
        router.get(route.path, route.handler);
        break;
    }
  }

  return {
    getPrefix: () => prefix,
    getRouter: () => router,
  };
}

export { Controller, createController };
