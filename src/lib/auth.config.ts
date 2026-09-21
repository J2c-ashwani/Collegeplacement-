import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = (user.id || '') as string;
        token.role = user.role;
        token.institutionId = user.institutionId;
        token.employerId = user.employerId;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        session.user.institutionId = token.institutionId as string | null;
        session.user.employerId = token.employerId as string | null;
        session.user.emailVerified = token.emailVerified as Date | null;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
