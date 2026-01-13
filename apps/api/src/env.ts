import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.url(),
});

export const env = envSchema.parse(process.env);
