import NextAuth from "next-auth";
// If NEXTAUTH_URL isn't provided in the environment (e.g. on Vercel),
// try to infer it from VERCEL_URL (which Vercel sets to the deployment hostname)
// and ensure it includes a protocol. This prevents `new URL(undefined)`
// runtime errors inside Auth.js when NEXTAUTH_URL is missing.
if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Secret used to encrypt/sign session tokens. Provide via NEXTAUTH_SECRET in your environment.
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.hashedPassword) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );

        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // user may be an AdapterUser or our custom User type — cast to any to avoid TypeScript mismatch during build
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        // session.user typing doesn't include our custom `role` property by default.
        // Cast to any to assign the role safely during runtime.
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
});
