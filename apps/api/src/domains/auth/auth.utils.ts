import type { LoginResponseDto } from "@/domains/auth/auth.types";
import type { User } from "@/domains/user/user.types";

export const AuthMapper = {
  toLoginResponse(user: User, accessToken: string): LoginResponseDto {
    return {
      publicId: user.publicId,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    };
  },
};
