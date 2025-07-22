import { NextAuthOptions } from "next-auth"
// import GithubProvider from "next-auth/providers/github"
// import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials"
import { connectToDB } from "./db";
import User from "@/models/Users";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
      // we can add as many login items here as per the requirement 
  //   GithubProvider({
  //     clientId: process.env.GITHUB_ID!,
  //     clientSecret: process.env.GITHUB_SECRET!,
  //   }),
  // GoogleProvider({
  //   clientId: process.env.GOOGLE_CLIENT_ID!,
  //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  // })
    CredentialProvider({
      name: 'Credentials',
      credentials: {
        email: {label: "email", type:"text"},
        password: {label: "password", type:"password"}
  },
  async authorize(credentials){
    if(!credentials?.email || !credentials?.password){
      throw new Error("Missing Email or Password");
    }
    try {
      await connectToDB()
      const user = await User.findOne({email: credentials.email})

      if(!user){
        throw new Error("No user found");
      }

      const isValid = await bcrypt.compare(
        credentials.password,
        user.password
      )

      if(!isValid){
        throw new Error("Password is not matched");
      }

      return {
        id: user._id.toString(), 
        email: user.email
      }
    } catch (error) {
      console.error("Auth Error", error);
      throw error
    }
  }
  })
    ],

    callbacks:{
      async jwt({token, user}){
        if(user){
          token.id = user.id
        }
        return token;
      },
      async session({session ,token ,user}){
        if(user){
          session.user.id = token.id as string
        }
        return session;
      },
    },

    pages:{
      signIn:"/login",
      error:"/login",
    },
    session:{
      maxAge: 30*24*60*60,
    },
    secret:process.env.NEXTAUTH_SECRET,
};