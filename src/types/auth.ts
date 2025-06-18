import type { User } from '@/lib/db';
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
