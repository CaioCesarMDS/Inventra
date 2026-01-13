import { ConflictError, NotFoundError } from "@/core/errors/";
import type {
  CreateUserDto,
  IUserService,
  IUsersRepository,
  PasswordHasher,
  UserDto,
} from "@/domains/user/user.types";
import { UserMapper } from "@/domains/user/user.utils";

export const userService = (
  repository: IUsersRepository,
  hashPassword: PasswordHasher,
): IUserService => ({
  async create(data: CreateUserDto): Promise<UserDto> {
    const [phoneExists, emailExists] = await Promise.all([
      repository.findByPhone(data.phone),
      repository.findByEmail(data.email),
    ]);

    if (phoneExists)
      throw new ConflictError(
        "Phone number already exists",
        "conflict.phone",
        "phone",
      );
    if (emailExists)
      throw new ConflictError(
        "Email already exists",
        "conflict.email",
        "email",
      );

    const hashedPassword = await hashPassword(data.password);

    const newUser = UserMapper.toPersistence(data, hashedPassword);

    const user = await repository.create(newUser);

    return UserMapper.toDto(user);
  },

  async findById(id: string): Promise<UserDto> {
    const user = await repository.findById(id);

    if (!user) throw new NotFoundError("User not found");

    return UserMapper.toDto(user);
  },
});
