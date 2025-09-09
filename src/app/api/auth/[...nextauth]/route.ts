import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "~/server/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // session: { strategy: "database" }, // or "jwt" (pick one that fits your app)
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    session: ({ session, user, token }) => {
      // add user.id to session.user for convenience
      if (session.user) {
        // user is only guaranteed during some flows; fall back to token.sub
        (session.user as any).id = user?.id ?? token?.sub ?? null;
      }
      return session;
    },
  },
});
