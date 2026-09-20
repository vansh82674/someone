import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      anonId: string;
      role: string;
      isVerified: boolean;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    anonId: string;
    role: string;
    isVerified: boolean;
    isAdmin: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    anonId: string;
    role: string;
    isVerified: boolean;
    isAdmin: boolean;
  }
}
