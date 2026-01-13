import type {
  UserRequest,
  UserResponse,
} from "@inventra/shared";

import type { userTable } from "@/core/db/schema/user";

export type User = typeof userTable.$inferSelect;
export type NewUser = typeof userTable.$inferInsert;


export type CreateUserDto = UserRequest;
export type UserDto = UserResponse;

export interface IUserController {
  create: (data: CreateUserDto) => Promise<UserDto>;
  getMe(userId: string): Promise<UserDto>;
  // findById(id: string): Promise<UserDto>;
  // updateById(id: string, data: Partial<UserDto>): Promise<UserDto>;
  // deleteById(id: string): Promise<void>;
}

export interface IUserService {
  create(data: CreateUserDto): Promise<UserDto>;
  findById(id: string): Promise<UserDto>;
  // updateById(id: string, data: Partial<UserDto>): Promise<UserDto>;
  // deleteById(id: string): Promise<void>;
}

export type PasswordHasher = (password: string) => Promise<string>;

export interface IUsersRepository {
  findById(publicId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  create(data: NewUser): Promise<User>;
}
