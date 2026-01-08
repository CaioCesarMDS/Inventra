import { z } from "zod";
import { Status } from "../../common";
import { Role } from "./enums";

export const userRequestSchema = z.object({
  name: z
    .string("Must be a text")
    .trim()
    .nonempty("Name is required")
    .min(5, "Minimum 5 characters required")
    .max(255, "Maximum 255 characters allowed"),
  phone: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return val.replace(/\D/g, "");
      }
      return val;
    },
    z
      .string()
      .nonempty("Phone is required")
      .min(10, "Minimum 10 digits required")
      .max(15, "Maximum 15 digits allowed"),
  ),
  email: z.email("Must be a valid email address"),
  password: z
    .string("Must be a text")
    .trim()
    .nonempty("Password is required")
    .min(8, "Minimum 8 characters required")
    .max(128, "Maximum 255 characters allowed")
    .regex(/[a-z]/, "Lowercase letter required")
    .regex(/[A-Z]/, "Uppercase letter required")
    .regex(/[0-9]/, "Number required")
    .regex(/[^a-zA-Z0-9]/, "Special character required"),
  role: z.enum(Role, "Select a valid role"),
});

export const userResponseSchema = z.object({
  publicId: z.uuid(),
  name: z.string(),
  phone: z.string(),
  email: z.email(),
  status: z.enum(Status),
  role: z.enum(Role),
  createdAt: z.date(),
});

export type UserRequest = z.infer<typeof userRequestSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
