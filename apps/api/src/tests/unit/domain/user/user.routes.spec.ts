import type { UserResponse } from "@inventra/shared";
import type { FastifyInstance } from "fastify";
import { beforeEach, describe, expect, it, type Mocked, vi } from "vitest";
import { type AppError, ConflictError } from "@/core/errors/";
import { userRoutes } from "@/domains/user/user.routes";
import type { IUserController } from "@/domains/user/user.types";
import {
  createTestServer,
  makeUserRequest,
  makeUserResponse,
} from "@/tests/factories";
import { parseJsonBody } from "@/tests/utils/parseJsonBody";

describe("userRoutes", () => {
  let app: FastifyInstance;
  let controller: Mocked<IUserController>;

  beforeEach(async () => {
    vi.resetAllMocks();
    app = createTestServer();
    controller = { create: vi.fn() };
    await app.register(userRoutes(controller));
    await app.ready();
  });

  it("should POST / (create) returns 201 and location header", async () => {
    const request = makeUserRequest();
    const user = makeUserResponse();

    controller.create.mockResolvedValue(user);

    const response = await app.inject({
      method: "POST",
      url: "/",
      payload: request,
    });

    const body = parseJsonBody<UserResponse>(response);

    expect(response.statusCode).toBe(201);
    expect(response.headers.location).toBe(`/users/${user.publicId}`);
    expect(body.publicId).toBe(user.publicId);
  });

  it("should return 409 when user already exists", async () => {
    const request = makeUserRequest();

    controller.create.mockRejectedValue(new ConflictError("Email exists"));

    const response = await app.inject({
      method: "POST",
      url: "/",
      payload: request,
    });

    const body = parseJsonBody<AppError>(response);

    expect(response.statusCode).toBe(409);
    expect(body).toMatchObject({
      message: "Email exists",
      statusCode: 409,
    });
  });
});
