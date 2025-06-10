import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { UserService } from '@/lib/db/user-service';
import type { StackAuthUser, AuthenticatedHandler } from '@/types/auth';

export async function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest) => {
    try {
      // Get the authenticated user from StackAuth
      const user = await stackServerApp.getUser();
      
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const stackUser: StackAuthUser = {
        id: user.id,
        primaryEmail: user.primaryEmail,
        displayName: user.displayName,
        profileImageUrl: user.profileImageUrl,
      };

      // Create or update user in our database
      await UserService.createOrUpdateUser(stackUser);

      // Get user from our database
      const dbUser = await UserService.getUserByStackId(user.id);
      
      if (!dbUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return await handler(request, stackUser, dbUser);
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}
