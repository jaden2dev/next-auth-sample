import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
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
            const user = { id: "1", name: "John Smith", email: "jsmith@example.com", role: "admin" };
            if (user) {
              return { id: user.id, name: user.name, email: user.email, token, role };
            } else {
              throw new Error("유효하지 않은 토큰입니다.");
            }
          } catch (error) {
            throw new Error("토큰 인증 실패");
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }: { token: any, user: any }) {
        if (user) {
          token.accessToken = user.token;
          token.role = user.role;
        }
        return token;
      },
      async session({ session, token }: { session: any, token: any }) {
        session.user = {
            id: token.id,
            name: token.name,
            email: token.email,
            role: token.role,
            permissions: token.permissions,
            department: token.department,
          };
          session.accessToken = token.accessToken;
          return session;
      },
    },
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
  };

const handler = NextAuth(authOptions as AuthOptions);

export { handler as GET, handler as POST }