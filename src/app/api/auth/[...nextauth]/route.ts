import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const ADMIN_USER = process.env.ADMIN_USER || "seu_usuario_seguro"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "sua_senha_segura_e_complexa"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (
          credentials?.username === ADMIN_USER &&
          credentials?.password === ADMIN_PASSWORD
        ) {
          return {
            id: "1",
            name: "Admin"
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }