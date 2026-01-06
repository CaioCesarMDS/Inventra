import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { db } from "@/core/db";
import { userRepository } from "@/domains/user/user.repository";
import type { User } from "@/domains/user/user.types";
import { makeUser } from "@/tests/factories";

vi.mock("@/core/db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
  },
}));

describe("userRepository", () => {
  const mockSelectChain = (users: User[]) => {
    const limit = vi.fn().mockResolvedValue(users);
    const where = vi.fn().mockReturnValue({ limit });
    const from = vi.fn().mockReturnValue({ where });

    (db.select as Mock).mockReturnValue({ from });
  };

  const mockInsertChain = (users: User[]) => {
    const returning = vi.fn().mockResolvedValue(users);
    const values = vi.fn().mockReturnValue({ returning });

    (db.insert as Mock).mockReturnValue({ values });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should findById returns user", async () => {
    const user = makeUser();
    const publicId = user.publicId;
    mockSelectChain([user]);

    const userFound = await userRepository.findById(publicId);

    expect(userFound).toBeDefined();
    expect(userFound?.publicId).toBe(publicId);
    expect(db.select).toHaveBeenCalledTimes(1);
  });

  it("should findByPhone returns user", async () => {
    const user = makeUser();
    mockSelectChain([user]);

    const userFound = await userRepository.findByPhone("11999999999");

    expect(userFound).toBeDefined();
    expect(userFound?.phone).toBe("11999999999");
  });

  it("should findByEmail returns user", async () => {
    const user = makeUser();
    mockSelectChain([user]);

    const userFound = await userRepository.findByEmail("john@example.com");

    expect(userFound).toBeDefined();
    expect(userFound?.email).toBe("john@example.com");
  });

  it("should create returns created user", async () => {
    const user = makeUser();
    mockInsertChain([user]);

    const userCreated = await userRepository.create(user);

    expect(userCreated).toBeDefined();
    expect(userCreated.email).toBe(user.email);
    expect(db.insert).toHaveBeenCalledTimes(1);
  });
});
