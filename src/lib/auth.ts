import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { loginSchema } from './validators/auth';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password, twoFactorCode } = parsedCredentials.data;

          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              institutionUsers: {
                select: { institutionId: true },
                take: 1,
              },
              student: {
                select: { institutionId: true },
              },
              employerUsers: {
                select: { employerId: true },
                take: 1,
              },
            },
          });

          if (!user || !user.passwordHash) return null;

          if (user.lockedUntil && user.lockedUntil > new Date()) {
            throw new Error('ACCOUNT_LOCKED');
          }

          if (user.status !== 'ACTIVE') {
            throw new Error('ACCOUNT_INACTIVE');
          }

          const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

          if (passwordsMatch) {
            if (user.twoFactorEnabled) {
              if (!twoFactorCode) {
                throw new Error('2FA_REQUIRED');
              }
            }

            await prisma.user.update({
              where: { id: user.id },
              data: {
                loginAttempts: 0,
                lastLoginAt: new Date(),
              },
            });

            const institutionId =
              user.student?.institutionId ||
              user.institutionUsers[0]?.institutionId ||
              null;

            const employerId = user.employerUsers[0]?.employerId || null;

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role as any,
              institutionId,
              employerId,
              emailVerified: user.emailVerified,
            };
          } else {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                loginAttempts: {
                  increment: 1,
                },
              },
            });
          }
        }

        return null;
      },
    }),
  ],
});
