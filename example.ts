import { createController, createApp } from "./src";

// Runs Express server for 5 seconds serving a route on /api/v1/yeet at port 3000

class YeetService {
  getFood() {
    return "food";
  }
}

const service = new YeetService();

const yeetController = createController({
  prefix: "/api/v1",
  routes: [
    {
      method: "GET",
      path: "/yeet",
      handler: (_req, res) => res.json(service.getFood()),
    },
  ],
});

const app = createApp({ port: 3000, controllers: [yeetController] });
app.run();

setTimeout(() => app.stop(), 5000);
