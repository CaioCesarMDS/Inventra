import { hash } from "argon2";
import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { userController } from "@/domains/user/user.controller";
import { userRepository } from "@/domains/user/user.repository";
import { userRoutes } from "@/domains/user/user.routes";
import { userService } from "@/domains/user/user.service";

export const userPlugin: FastifyPluginAsync = async (
  fastify: FastifyInstance,
) => {
  const service = userService(userRepository, hash);
  const controller = userController(service);

  fastify.register(userRoutes(controller), { prefix: "/users" });
};
