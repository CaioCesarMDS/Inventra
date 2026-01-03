import { buildApp } from "@/app";
import { env } from "@/env";

const app = buildApp();

const port = env.PORT;

app.listen({ port, host: "0.0.0.0" }).then(() => {
  console.log(`🔥 HTTP server running on http://localhost:${port}`);
  console.log(`📚 Docs available at http://localhost:${port}/docs`);
});
