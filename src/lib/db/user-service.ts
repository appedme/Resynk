import type { User } from '@prisma/client';
import { prisma } from '../prisma';

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
        return await prisma.user.upsert({
            where: { stackId: stackAuthUser.id },
            update: {
                email: stackAuthUser.primaryEmail || '',
                name: stackAuthUser.displayName,
                avatar: stackAuthUser.profileImageUrl,
                updatedAt: new Date(),
            },
            create: {
                stackId: stackAuthUser.id,
                email: stackAuthUser.primaryEmail || '',
                name: stackAuthUser.displayName,
                avatar: stackAuthUser.profileImageUrl,
            },
        });
    }

    /**
     * Get user by StackAuth ID
     */
    static async getUserByStackId(stackId: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { stackId },
        });
    }

    /**
     * Get user with resumes
     */
    static async getUserWithResumes(stackId: string) {
        return await prisma.user.findUnique({
            where: { stackId },
            include: {
                resumes: {
                    orderBy: { updatedAt: 'desc' },
                    include: {
                        template: true,
                    },
                },
            },
        });
    }

    /**
     * Delete user and all associated data
     */
    static async deleteUser(stackId: string): Promise<void> {
        await prisma.user.delete({
            where: { stackId },
        });
    }
}
