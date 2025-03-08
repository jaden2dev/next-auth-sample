import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT as NextAuthJWT } from "next-auth/jwt";
import { Session as NextAuthSession } from "next-auth";

// Define types for the user and token
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface JWT extends NextAuthJWT {
  accessToken?: string;
  role?: string;
  id?: string;
  name?: string | null;
  email?: string | null;
  permissions?: string[];
  department?: string;
}

interface Session extends NextAuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions?: string[];
    department?: string;
  };
  accessToken: string;
  expires: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Custom Login",        
      credentials: {
        token: { label: "Token", type: "text" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        const token = credentials?.token;
        const role = credentials?.role || "user";
  
        if (!token) {
          throw new Error("토큰이 제공되지 않았습니다.");
        }
  
        try {
          const user: User = { id: "1", name: "John Smith", email: "jsmith@example.com", role: "admin", token };
          if (user) {
            return { id: user.id, name: user.name, email: user.email, token, role };
          } else {
            throw new Error("유효하지 않은 토큰입니다.");
          }
        } catch (error) {
          throw new Error("토큰 인증 실패", error as Error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          accessToken: user.token,
          role: user.role,
          id: user.id,
          name: user.name,
          email: user.email,
        };
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = {
        id: token.id || "",
        name: token.name || "",
        email: token.email || "",
        role: token.role || "user",
        permissions: token.permissions,
        department: token.department,
      };
      session.accessToken = token.accessToken || "";
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
