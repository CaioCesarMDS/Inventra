import { eq } from "drizzle-orm";
import { db } from "@/core/db";
import { userTable } from "@/core/db/schema/user";
import type {
  IUsersRepository,
  NewUser,
  User,
} from "@/domains/user/user.types";

export const userRepository: IUsersRepository = {
  async findById(publicId: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.publicId, publicId))
      .limit(1);
    return user ?? null;
  },

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);
    return user ?? null;
  },

  async findByPhone(phone: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.phone, phone))
      .limit(1);
    return user ?? null;
  },

  async create(data: NewUser): Promise<User> {
    const [user] = await db.insert(userTable).values(data).returning();
    return user;
  },
};
