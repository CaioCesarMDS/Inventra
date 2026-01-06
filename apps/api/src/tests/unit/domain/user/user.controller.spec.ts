import { beforeEach, describe, expect, it, type Mocked, vi } from "vitest";
import { userController } from "@/domains/user/user.controller";
import type { IUserService } from "@/domains/user/user.types";
import { makeUser, makeUserRequest } from "@/tests/factories";

describe("userController", () => {
  let service: Mocked<IUserService>;

  beforeEach(() => {
    vi.resetAllMocks();

    service = {
      create: vi.fn(),
    };
  });

  it("calls service.create and returns the result", async () => {
    const user = makeUser();
    const request = makeUserRequest();

    service.create.mockResolvedValue(user);

    const controller = userController(service);

    const response = await controller.create(request);

    expect(service.create).toHaveBeenCalledWith(request);
    expect(service.create).toHaveBeenCalledTimes(1);
    expect(response).toEqual(user);
  });
});
