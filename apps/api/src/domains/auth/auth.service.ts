import { UnauthorizedError } from "@/core/errors";
import type {
  IAuthService,
  JwtSigner,
  LoginRequestDto,
  LoginResponseDto,
  PasswordVerifier,
} from "@/domains/auth/auth.type";
import type { IUsersRepository } from "@/domains/user/user.types";

export const authService = (
  userRepository: IUsersRepository,
  verifyPassword: PasswordVerifier,
  signJwt: JwtSigner,
): IAuthService => ({
  async login(data: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const passwordValid = await verifyPassword(user.password, data.password);

    if (!passwordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const accessToken = await signJwt({
      sub: user.publicId,
      role: user.role,
    });

    const response = {
      publicId: user.publicId,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    }

    return response;
  },
});
