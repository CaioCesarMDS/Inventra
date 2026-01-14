import {
  type UserRequest,
  userRequestSchema,
  userResponseSchema,
} from "@inventra/shared";
import type { FastifyPluginAsync } from "fastify";
import { createResponseSchema } from "@/core/http/create-response";
import type { IUserController } from "@/domains/user/user.types";

export const userRoutes = (controller: IUserController): FastifyPluginAsync => {
  return async (fastify) => {
    fastify.post<{ Body: UserRequest }>(
      "/",
      {
        schema: {
          summary: "Create a user",
          description: "Creates a new user account using the provided registration data.",
          tags: ["Users"],
          body: userRequestSchema,
          response: createResponseSchema(userResponseSchema, {
            status: 201,
            includeErrors: ["400", "409"],
          }),
        },
      },
      async (request, reply) => {
        const user = await controller.create(request.body);
        return reply
          .status(201)
          .header("Location", `/users/${user.publicId}`)
          .send(user);
      },
    );
    fastify.get(
      "/me",
      {
        preHandler: [fastify.authenticate],
        schema: {
          summary: "Get current authenticated user",
          description: "Returns the profile information of the currently authenticated user based on the access token.",
          tags: ["Users"],
          response: createResponseSchema(userResponseSchema, {
            includeErrors: ["400", "401"],
          }),
        },
      },
      async (request, reply) => {
        const user = await controller.getMe(request.user.sub);
        return reply.status(200).send(user);
      },
    );
  };
};
