import { userRequestSchema, userResponseSchema } from "@inventra/shared";
import type { FastifyPluginAsync } from "fastify";
import type { IUserController } from "@/domains/user/user.types";

export const userRoutes = (controller: IUserController): FastifyPluginAsync => {
  return async (fastify) => {
    fastify.post(
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
      controller.create,
    );
  };
};
