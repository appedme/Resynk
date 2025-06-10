import type { User } from '@prisma/client';
import type { NextRequest, NextResponse } from 'next/server';

export interface StackAuthUser {
  id: string;
  primaryEmail: string | null;
  displayName: string | null;
  profileImageUrl: string | null;
}

export type AuthenticatedHandler = (
  request: NextRequest, 
  stackUser: StackAuthUser, 
  dbUser: User
) => Promise<NextResponse>;
