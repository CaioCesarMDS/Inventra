import type { UserRequest } from "@inventra/shared";
import { ConflictError } from "@/core/errors/";
import type {
  IUserService,
  IUsersRepository,
  PasswordHasher,
  User,
} from "@/domains/user/user.types";

export const userService = (
  repository: IUsersRepository,
  hashPassword: PasswordHasher,
): IUserService => ({
  async create(data: UserRequest): Promise<Omit<User, "password">> {
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

    const user = await repository.create({
      ...data,
      password: hashedPassword,
    });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});
