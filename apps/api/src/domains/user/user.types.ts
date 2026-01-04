import type { UserRequest, UserResponse } from "@inventra/shared";

import type { userTable } from "@/core/db/schema/user";

export type User = typeof userTable.$inferSelect;
export type NewUser = typeof userTable.$inferInsert;

export interface IUserController {
  create: (data: UserRequest) => Promise<UserResponse>;
}

export interface IUserService {
  create(data: UserRequest): Promise<Omit<User, "password">>;
}

export interface IUsersRepository {
  findById(publicId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  create(data: NewUser): Promise<User>;
}
