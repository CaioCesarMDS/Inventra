import {
  type UserRequest,
  userRequestSchema,
  userResponseSchema,
} from "@inventra/shared";
import type { FastifyPluginAsync } from "fastify";
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
          response: { 201: userResponseSchema },
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
