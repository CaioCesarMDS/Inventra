import { randomUUID } from "node:crypto";
import type { UserRequest, UserResponse } from "@inventra/shared";
import type { User } from "@/domains/user/user.types";

type Override<T> = Partial<T>;

export const makeUser = (override: Override<User> = {}): User => ({
  id: 1,
  publicId: randomUUID(),
  name: "John Doe",
  phone: "11999999999",
  email: "john@example.com",
  password: "hashed-password",
  status: "ACTIVE",
  role: "VIEWER",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: null,
  deletedAt: null,
  ...override,
});

export const makeUserRequest = (
  override: Override<UserRequest> = {},
): UserRequest => ({
  name: "John Doe",
  phone: "11999999999",
  email: "john@example.com",
  password: "Password123!",
  role: "VIEWER",
  ...override,
});

export const makeUserResponse = (
  override: Override<UserResponse> = {},
): UserResponse => ({
  publicId: randomUUID(),
  name: "John Doe",
  phone: "11999999999",
  email: "john@example.com",
  status: "ACTIVE",
  role: "VIEWER",
  createdAt: new Date(),
  ...override,
});
