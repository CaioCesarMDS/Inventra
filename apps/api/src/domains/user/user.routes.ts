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
          summary: "Create a new user",
          description: "Create a new user with the provided data",
          tags: ["Users"],
          body: userRequestSchema,
          response: createResponseSchema(userResponseSchema, {
            status: 201,
            includeErrors: ["400", "409"]
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
  };
};
