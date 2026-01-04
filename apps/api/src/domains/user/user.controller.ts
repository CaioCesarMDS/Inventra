import type { UserRequest, UserResponse } from "@inventra/shared";
import type { IUserController, IUserService } from "@/domains/user/user.types";

export const userController = (service: IUserService): IUserController => ({
  async create(data: UserRequest): Promise<UserResponse> {
    const user = await service.create(data);
    return user;
  },
});
