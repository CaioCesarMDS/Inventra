import {
  type LoginRequest,
  LoginRequestSchema,
  LoginResponseSchema,
} from "@inventra/shared";
import type { FastifyPluginAsync } from "fastify";
import { createResponseSchema } from "@/core/http/create-response";
import type { IAuthController } from "@/domains/auth/auth.type";

export const authRoutes = (controller: IAuthController): FastifyPluginAsync => {
  return async (fastify) => {
    fastify.post<{ Body: LoginRequest }>(
      "/login",
      {
        schema: {
          summary: "Login a user",
          description: "Authenticate user using email and password",
          tags: ["Auth"],
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
