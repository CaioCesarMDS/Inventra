import "@fastify/jwt";
import type { AuthTokenPayload } from "@/domains/auth/auth.types";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: AuthTokenPayload;
    user: AuthTokenPayload;
  }
}
