import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db/mongoose';
import UserModel from '@/lib/db/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e password richiesti');
        }

        await connectDB();

        const user = await UserModel.findOne({ email: credentials.email.toLowerCase() });

        if (!user) {
          throw new Error('Email o password non validi');
        }

        const isPasswordValid = bcrypt.compareSync(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Email o password non validi');
        }

        if (!user.verify.verified) {
          throw new Error('Account non verificato. Controlla la tua email.');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
          isAdmin: user.isAdmin,
          isSeller: user.isSeller,
          hasAd: user.hasAd,
          account: user.account,
          sellerName: user.seller.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.isSeller = user.isSeller;
        token.hasAd = user.hasAd;
        token.account = user.account;
        token.sellerName = user.sellerName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.isSeller = token.isSeller as boolean;
        session.user.hasAd = token.hasAd as boolean;
        session.user.account = token.account as string;
        session.user.sellerName = token.sellerName as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
