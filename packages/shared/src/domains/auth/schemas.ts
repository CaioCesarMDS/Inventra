import { z } from "zod";
import { Role } from "../user/";

export const LoginRequestSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const LoginResponseSchema = z.object({
  publicId: z.uuid(),
  name: z.string(),
  email: z.email(),
  role: z.enum(Role),
  accessToken: z.string(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
