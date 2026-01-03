import type { UserRequest } from "@inventra/shared";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { IUserService } from "@/domains/user/user.types";

export const userController = (service: IUserService) => ({
  async create(
    request: FastifyRequest<{ Body: UserRequest }>,
    reply: FastifyReply,
  ) {
    const user = await service.create(request.body);

    return reply.status(201).send(user);
  },
});
