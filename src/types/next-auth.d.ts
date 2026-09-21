import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Role } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
      institutionId: string | null;
      employerId: string | null;
      emailVerified: Date | null;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: Role;
    institutionId: string | null;
    employerId: string | null;
    emailVerified: Date | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
    institutionId: string | null;
    employerId: string | null;
    emailVerified: Date | null;
  }
}
