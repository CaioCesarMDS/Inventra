import { UnauthorizedError } from "@/core/errors";
import type {
  IAuthService,
  JwtSigner,
  LoginRequestDto,
  LoginResponseDto,
  PasswordVerifier,
} from "@/domains/auth/auth.types";
import { AuthMapper } from "@/domains/auth/auth.utils";
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

    return AuthMapper.toLoginResponse(user, accessToken);
  },
});
