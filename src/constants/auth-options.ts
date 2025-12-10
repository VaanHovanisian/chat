import { prisma } from "@/prisma/prisma-client";
import { compare, hashSync } from "bcrypt";
import { AuthOptions } from "next-auth";
import credentialsProvider from "next-auth/providers/credentials";
export const authOptions: AuthOptions = {
  providers: [
    credentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isPassword = await compare(credentials.password, user.password);
        if (!isPassword || !user.verified) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
    // Добавьте ваших провайдеров аутентификации здесь
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        return token;
      }

      // при обновлении токена
      if (!token.email) return token;

      const dbUser = await prisma.user.findUnique({
        where: { email: token.email },
        include: {
          messages: {
            include: {
              chat: true,
            },
          },
        },
      });

      if (dbUser) {
        token.id = dbUser.id;
        token.name = dbUser.name;
        token.chatId = dbUser.messages.map((msg) => msg.chatId)[0];
      }

      return token;
    },
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      if (!user.email) return false;

      const dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            {
              provider: account?.provider || undefined,
              providerId: account?.providerAccountId || undefined,
            },
            { email: user?.email || undefined },
          ],
        },
      });

      if (dbUser) {
        await prisma.user.update({
          where: { id: dbUser.id },
          data: {
            provider: account?.provider || undefined,
            providerId: account?.providerAccountId || undefined,
          },
        });
        return true;
      }
      await prisma.user.create({
        data: {
          email: user?.email,
          provider: account?.provider,
          providerId: account?.providerAccountId,
          name: user?.name || "jigyar",
          image: user?.image,
          verified: new Date(),
          password: hashSync(crypto.randomUUID(), 10),
        },
      });

      return true;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.chatId = token.chatId as string;
      }
      return session;
    },
  },
};
