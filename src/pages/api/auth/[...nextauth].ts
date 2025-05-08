// pages/api/auth/[...nextauth].ts

import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb/mongodb";
import { NextAuthOptions } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth/next";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise, { databaseName: "hire-flow" }),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/graphql`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                mutation AuthenticateUser($email: String!, $password: String!) {
                  authenticateUser(email: $email, password: $password) {
                    id
                    email
                    name
                  }
                }
              `,
              variables: credentials
            })
          });

          const { data, errors } = await res.json();
          if (errors) throw new Error(errors[0].message);
          
          return data?.authenticateUser || null;
        } catch (error) {
          console.error("Authentication Error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name,
        email: token.email
      };
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    return await NextAuth(req, res, authOptions);
}