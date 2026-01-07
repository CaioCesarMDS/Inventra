import type {
  CreateUserDto,
  IUserController,
  IUserService,
  UserDto,
} from "@/domains/user/user.types";

export const userController = (service: IUserService): IUserController => ({
  async create(data: CreateUserDto): Promise<UserDto> {
    const user = await service.create(data);
    return user;
  },
});
