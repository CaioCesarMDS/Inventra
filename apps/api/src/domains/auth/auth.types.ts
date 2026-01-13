import type { SignOptions } from "@fastify/jwt";
import type { LoginRequest, LoginResponse, Role } from "@inventra/shared";

export type LoginRequestDto = LoginRequest;
export type LoginResponseDto = LoginResponse;

export interface IAuthController {
  login(data: LoginRequestDto): Promise<LoginResponseDto>;
}

export interface IAuthService {
  login(data: LoginRequestDto): Promise<LoginResponseDto>;
}

export type PasswordVerifier = (
  userPassword: string,
  password: string,
) => Promise<boolean>;

export interface AuthTokenPayload {
  sub: string;
  role: Role;
}

export type JwtSigner = (
  payload: AuthTokenPayload,
  options?: SignOptions,
) => Promise<string>;
