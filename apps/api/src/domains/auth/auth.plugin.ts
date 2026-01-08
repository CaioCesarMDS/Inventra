import { verify } from "argon2";
import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { authController } from "@/domains/auth/auth.controller";
import { authRoutes } from "@/domains/auth/auth.routes";
import { authService } from "@/domains/auth/auth.service";
import type {
  JwtSigner,
  PasswordVerifier,
} from "@/domains/auth/auth.type";
import { userRepository } from "@/domains/user/user.repository";

export const authPlugin: FastifyPluginAsync = async (
  fastify: FastifyInstance,
) => {
  const passwordVerifier: PasswordVerifier = async (userPassword, password) =>
    verify(userPassword, password);

  const signJwt: JwtSigner = async (payload, options) => {
    return fastify.jwt.sign(payload, options);
  };

  const service = authService(userRepository, passwordVerifier, signJwt);
  const controller = authController(service);

  fastify.register(authRoutes(controller), { prefix: "/auth" });
};
