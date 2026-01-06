import { type Mocked, vi } from "vitest";
import type { IUsersRepository } from "@/domains/user/user.types";

export const makeUsersRepositoryMock = (): Mocked<IUsersRepository> => {
  return {
    findById: vi.fn(),
    findByEmail: vi.fn(),
    findByPhone: vi.fn(),
    create: vi.fn(),
  };
};
