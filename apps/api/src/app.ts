import { errorHandler } from "@/core/middlewares/error-handler";
import { userPlugin } from "@/domains/user/user.plugin";
import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { fastify } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

export function buildApp(): ReturnType<typeof fastify> {
  const app = fastify({
    logger: {
      level: "debug",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          ignore: "pid,hostname",
        },
      },
    },
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setErrorHandler(errorHandler);

  app.register(fastifyCors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  });

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Inventra API",
        description: "API for inventory management",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  app.register(ScalarApiReference, {
    routePrefix: "/docs",
  });

  app.register(userPlugin);

  return app;
}
