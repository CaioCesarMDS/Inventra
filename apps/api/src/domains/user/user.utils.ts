import type {
  CreateUserDto,
  NewUser,
  User,
  UserDto,
} from "@/domains/user/user.types";

export const UserMapper = {
  toPersistence(dto: CreateUserDto, hashedPassword: string): NewUser {
    return {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      password: hashedPassword,
      role: dto.role,
      status: "ACTIVE",
    };
  },

  toDto(user: User): UserDto {
    return {
      publicId: user.publicId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    };
  },

  toDtoList(users: User[]): UserDto[] {
    return users.map((u) => this.toDto(u));
  },
};
