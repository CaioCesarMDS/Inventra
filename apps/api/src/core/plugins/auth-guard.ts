import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

export const authGuardPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorate("authenticate", async (request: FastifyRequest) => {
    await request.jwtVerify();
  });
});
