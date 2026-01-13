import type { Role } from "@inventra/shared";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ForbiddenError, UnauthorizedError } from "@/core/errors";

export const roleGuard = (allowedRoles: Role[]) => {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    const user = request.user;

    if (!user) {
      throw new UnauthorizedError("Authentication required");
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenError("Insufficient permissions");
    }
  };
};
