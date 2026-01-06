import {
  beforeEach,
  describe,
  expect,
  it,
  type Mocked,
  type MockedFunction,
  vi,
} from "vitest";
import { ConflictError } from "@/core/errors";
import { userService } from "@/domains/user/user.service";
import type {
  IUserService,
  IUsersRepository,
  PasswordHasher,
} from "@/domains/user/user.types";
import { makeUser, makeUserRequest } from "@/tests/factories";
import { makeUsersRepositoryMock } from "@/tests/mocks/user.repository.mock";

describe("userService", () => {
  let repository: Mocked<IUsersRepository>;
  let hasher: MockedFunction<PasswordHasher>;
  let service: IUserService;

  beforeEach(() => {
    vi.resetAllMocks();

    repository = makeUsersRepositoryMock();
    hasher = vi.fn() as MockedFunction<PasswordHasher>;

    service = userService(repository, hasher);
  });

  it("should throw ConflictError when phone already exists", async () => {
    repository.findByPhone.mockResolvedValue(makeUser());

    const request = makeUserRequest();
    const promise = service.create(request);

    await expect(promise).rejects.toBeInstanceOf(ConflictError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("should throw ConflictError when email already exists", async () => {
    repository.findByPhone.mockResolvedValue(null);
    repository.findByEmail.mockResolvedValue(makeUser());

    const request = makeUserRequest();
    const promise = service.create(request);

    await expect(promise).rejects.toBeInstanceOf(ConflictError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("should create user successfully and return data without password", async () => {
    const request = makeUserRequest();
    const user = makeUser();

    repository.findByPhone.mockResolvedValue(null);
    repository.findByEmail.mockResolvedValue(null);
    hasher.mockResolvedValue("hashed-password");
    repository.create.mockResolvedValue(user);

    const result = await service.create(request);

    expect(result).not.toHaveProperty("password");
    expect(result.publicId).toBe(user.publicId);
    expect(hasher).toHaveBeenCalledTimes(1);
    expect(hasher).toHaveBeenCalledWith(request.password);
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        password: "hashed-password",
      }),
    );
  });
});
