import { z } from "zod";
import { StatusEnum } from "../common";

export enum Role {
  ADMIN = "ADMIN",
  OPERATOR = "OPERATOR",
  VIEWER = "VIEWER",
}

export const createUserSchema = z.object({
  name: z.string().min(3),
  phone: z
    .string()
    .min(10)
    .max(15)
    .regex(/^\d+$/, { message: "Invalid phone number" })
    .trim(),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must not exceed 32 characters")
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character",
    })
    .trim(),
  role: z.enum(Role),
});

export const userResponseSchema = z.object({
  publicId: z.uuid(),
  name: z.string(),
  phone: z.string(),
  email: z.email(),
  status: z.enum(StatusEnum),
  role: z.enum(Role),
  createdAt: z.date(),
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
