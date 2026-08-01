import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { db } from "./lib/drizzle"
import { createUser } from "./lib/actions"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google({
    profile: (profile) => {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture
      }
    }
  })],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.id = profile.sub
      }
      return token
    },
    async signIn({ account, user, profile }) {
      try {
        console.log("SignIn callback called with account:", account, "user:", user, "profile:", profile)
        const userExists = await db.query.users.findFirst({
          where: {
            id: profile?.sub as string
          }
        })
        if (!userExists) {
          createUser({
            id: profile?.sub as string,
            email: profile?.email as string,
            name: profile?.name as string,
            image: profile?.picture as string
          })
        }
        return true
      } catch (error) {
        console.error("Error during sign-in:", error)
        return false
      }
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    }
  }
})