# [Squash](https://www.npmjs.com/package/squashjs) &middot; [![npm version](https://img.shields.io/npm/v/squashjs.svg?style=flat)](https://www.npmjs.com/package/squashjs)

Squash is a TypeScript library for building backend services.

* **Declarative:** Declarative components make your code more predictable, simpler to understand, and easier to debug.
* **Component-Based:** Build encapsulated components that manage their own routing, being provided the handlers.
* **Separation of concerns:** Inspired by React, each component represents a separation of *your* applications concerns, not the technology, moving away from having handlers, controllers, etc folders in your project.

## Installation

* `npm install squashjs`
* `yarn add squashjs`

## Examples

There is a complex example with middlewares in `example.ts`. Here is a simple one to get you started:

```ts
import { createApp, createComponent } from "squashjs";
const userComponent = createComponent({
  prefix: "/api/v1",
  routes: [
    {
      method: "GET",
      path: "/user",
      handler: (req, res) => res.json("happy person :)"),
    }
  ],
});

const app = createApp({ port: 8080, components: [userComponent] });
app.run();
```

This example will serve a route at /api/v1/user which returns "happy person :)", on port 8080.
