import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { UserService } from '@/lib/db/user-service';
import type { StackAuthUser, AuthenticatedHandler } from '@/types/auth';

export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest) => {
    try {
      // Get the authenticated user from StackAuth with request context
      const user = await stackServerApp.getUser({ request });

      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const stackUser: StackAuthUser = {
        id: user.id,
        primaryEmail: user.primaryEmail,
        displayName: user.displayName,
        profileImageUrl: user.profileImageUrl,
      };

      console.log('🔐 StackAuth user authenticated:', {
        id: stackUser.id,
        email: stackUser.primaryEmail,
        name: stackUser.displayName
      });

      // Create or update user in our database
      const dbUser = await UserService.createOrUpdateUser(stackUser);
      console.log('💾 Database user created/updated:', {
        id: dbUser.id,
        stackId: dbUser.stackId,
        email: dbUser.email
      });

      return await handler(request, stackUser, dbUser);
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}
