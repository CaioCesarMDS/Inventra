import type {
  IAuthController,
  IAuthService,
  LoginRequestDto,
  LoginResponseDto,
} from "@/domains/auth/auth.types";

export const authController = (service: IAuthService): IAuthController => ({
  async login(data: LoginRequestDto): Promise<LoginResponseDto> {
    const response = await service.login(data);
    return response;
  },
});
