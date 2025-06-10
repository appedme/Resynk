"use client";

import { StackProvider, StackTheme } from "@stackframe/stack";

export default function StackAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <StackProvider
      projectId={process.env.NEXT_PUBLIC_STACK_PROJECT_ID!}
      publishableClientKey={process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!}
      theme={StackTheme.withDefaults({
        colors: {
          primary: "hsl(var(--primary))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
        },
      })}
    >
      {children}
    </StackProvider>
  );
}
