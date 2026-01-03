import type { UserRequest } from "@inventra/shared";
import type { hash } from "argon2";
import { AppError } from "@/core/errors/app-error";
import type { IUsersRepository, User } from "@/domains/user/user.types";

export const userService = (
  repository: IUsersRepository,
  hashPassword: typeof hash,
) => ({
  async create(data: UserRequest): Promise<Omit<User, "password">> {
    const [phoneExists, emailExists] = await Promise.all([
      repository.findByPhone(data.phone),
      repository.findByEmail(data.email),
    ]);

    if (phoneExists) throw new AppError("Phone number already exists", 409);
    if (emailExists) throw new AppError("Email already exists", 409);

    const hashedPassword = await hashPassword(data.password);

    const user = await repository.create({
      ...data,
      password: hashedPassword,
    });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});
