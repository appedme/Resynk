import { eq } from 'drizzle-orm';
import { db, users, resumes, templates, type User, type NewUser } from './index';

export class UserService {
  /**
   * Create or update a user from StackAuth data
   */
  static async createOrUpdateUser(stackAuthUser: {
    id: string;
    primaryEmail: string | null;
    displayName: string | null;
    profileImageUrl: string | null;
  }): Promise<User> {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.stackId, stackAuthUser.id))
      .limit(1);

    if (existingUser.length > 0) {
      // Update existing user
      const [updatedUser] = await db
        .update(users)
        .set({
          email: stackAuthUser.primaryEmail || '',
          name: stackAuthUser.displayName,
          avatar: stackAuthUser.profileImageUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.stackId, stackAuthUser.id))
        .returning();

      return updatedUser;
    } else {
      // Create new user
      const [newUser] = await db
        .insert(users)
        .values({
          stackId: stackAuthUser.id,
          email: stackAuthUser.primaryEmail || '',
          name: stackAuthUser.displayName,
          avatar: stackAuthUser.profileImageUrl,
        })
        .returning();

      return newUser;
    }
  }

  /**
   * Get user by StackAuth ID
   */
  static async getUserByStackId(stackId: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.stackId, stackId))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Get user with their resumes
   */
  static async getUserWithResumes(stackId: string) {
    const user = await this.getUserByStackId(stackId);
    if (!user) return null;

    const userResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, user.id))
      .orderBy(resumes.updatedAt);

    return {
      ...user,
      resumes: userResumes,
    };
  }

  /**
   * Delete user and all associated data
   */
  static async deleteUser(stackId: string): Promise<void> {
    await db.delete(users).where(eq(users.stackId, stackId));
  }
}
