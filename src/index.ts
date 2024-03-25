import { Elysia, t } from "elysia";
import serverTiming from "@elysiajs/server-timing";

const beforeHandler = () => new Elysia()
  .derive({ as: "scoped" }, ({ headers: { authorization } }) => ({
    get responseControl() {
      return authorization;
    }
  }))
  .onBeforeHandle({ as: "scoped" }, async ({ set, responseControl }) => {
    if (responseControl === "SendNope") {
      set.status = 400;
      return "Nope";
    }

    await fetch("http://example.com");
  })
  .model({
    nopeSchema: t.String({ default: "Nope" }),
  });

const route = new Elysia()
  .model({
    okSchema: t.String({ default: "OK" }),
  })
  .use(beforeHandler())
  .get("/", async () => {
    await fetch("http://example.com");
    return "OK";
  }, {
    type: "application/json",
    response: {
      200: "okSchema",
      400: "nopeSchema",
    },
  });

export const app = new Elysia()
  .onError({ as: "global" }, ({ error }) => {
    console.log(error);
  })
  .onRequest(({ request }) => {
    console.log(`🟢 ${request.method} ${request.url}`);
  })
  .onResponse(({ request }) => {
    console.log(`🛑 ${request.method} ${request.url}`);
  })
  .use(serverTiming()) // I cause Timeouts!
  .use(route)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
