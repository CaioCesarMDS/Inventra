import {
  type LoginRequest,
  LoginRequestSchema,
  LoginResponseSchema,
} from "@inventra/shared";
import type { FastifyPluginAsync } from "fastify";
import { createResponseSchema } from "@/core/http/create-response";
import type { IAuthController } from "@/domains/auth/auth.types";

export const authRoutes = (controller: IAuthController): FastifyPluginAsync => {
  return async (fastify) => {
    fastify.post<{ Body: LoginRequest }>(
      "/login",
      {
        schema: {
          summary: "Authenticate user",
          description: "Authenticates a user using email and password and returns an access token.",
          tags: ["Auth"],
          security: [],
          body: LoginRequestSchema,
          response: createResponseSchema(LoginResponseSchema, {
            includeErrors: ["400", "401"],
          }),
        },
      },
      async (request, reply) => {
        const user = await controller.login(request.body);
        return reply.status(200).send(user);
      },
    );
  };
};
