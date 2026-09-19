import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const res = await fetch("http://localhost:8081/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const user = await res.json();

          if (res.ok && user) {
            return user;
          }

          throw new Error(user.error || "Login failed");
        } catch (error: any) {
          throw new Error(error.message || "An error occurred during login");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // 1. The `trigger === "update"` block allows us to refresh the session 
    // without forcing the user to log out and log back in!
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.anonId = (user as any).anonId;
        token.role = (user as any).role;
        token.isVerified = (user as any).isVerified;
      }

      if (trigger === "update" && session) {
        token.role = session.role;
        token.isVerified = session.isVerified;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).anonId = token.anonId;
        (session.user as any).role = token.role;
        (session.user as any).isVerified = token.isVerified;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-default-key-for-dev",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
