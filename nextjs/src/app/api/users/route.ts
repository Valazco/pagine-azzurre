import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import connectDB from '@/lib/db/mongoose';
import UserModel from '@/lib/db/models/User';
import NewsletterModel from '@/lib/db/models/Newsletter';
import { authOptions } from '@/lib/auth/config';
import { sendVerificationEmail } from '@/lib/services/email';

// GET /api/users - Admin only: list all users
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 });
    }

    await connectDB();

    const users = await UserModel.find({});
    const sanitizedUsers = users.map((user) => user.toJSON());

    return NextResponse.json(sanitizedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Errore nel recupero utenti' },
      { status: 500 }
    );
  }
}

// POST /api/users - Register new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, sellername, phone, cf, referer, newsletter } = body;

    // Validation
    if (!username || !email || !password || !sellername) {
      return NextResponse.json(
        { message: 'Campi obbligatori mancanti' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Email non valida' },
        { status: 400 }
      );
    }

    // Password validation (min 6 chars)
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'La password deve avere almeno 6 caratteri' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if email already exists
    const existingEmail = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return NextResponse.json(
        { message: 'Indirizzo email già in uso' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsername = await UserModel.findOne({ username: username.toUpperCase() });
    if (existingUsername) {
      return NextResponse.json(
        { message: 'Username già in uso' },
        { status: 400 }
      );
    }

    // Check if sellername already exists
    const existingSellerName = await UserModel.findOne({ 'seller.name': sellername });
    if (existingSellerName) {
      return NextResponse.json(
        { message: 'Nome venditore già in uso' },
        { status: 400 }
      );
    }

    // Hash password and create wallet
    const hashedPassword = bcrypt.hashSync(password, 8);
    // Generate wallet using viem
    const privateKey = generatePrivateKey();
    const walletAccount = privateKeyToAccount(privateKey);
    const trustedLink = uuidv4();

    // Create user
    const user = new UserModel({
      account: walletAccount.address,
      accountKey: privateKey,
      username: username.toUpperCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || undefined,
      cf: cf || undefined,
      referer: referer || undefined,
      seller: { name: sellername },
      isSeller: true,
      hasAd: false,
      verify: { trusted_link: trustedLink, verified: false },
    });

    const createdUser = await user.save();

    // Handle newsletter subscription
    let isNewsletterSubscribed = false;
    if (newsletter) {
      const existingSubscriber = await NewsletterModel.findOne({ email: email.toLowerCase() });
      if (!existingSubscriber) {
        const newsletterEntry = new NewsletterModel({
          email: email.toLowerCase(),
          verified: true,
        });
        await newsletterEntry.save();
      }
      isNewsletterSubscribed = true;
    }

    // Send verification email
    const verificationLink = `${process.env.NEXTAUTH_URL}/verification/${trustedLink}`;
    try {
      await sendVerificationEmail(
        createdUser.email,
        createdUser.username,
        verificationLink,
        isNewsletterSubscribed
      );
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      // Continue even if email fails - user can request resend
    }

    return NextResponse.json({
      _id: createdUser._id.toString(),
      account: createdUser.account,
      username: createdUser.username,
      email: createdUser.email,
      phone: createdUser.phone,
      cf: createdUser.cf,
      isSeller: createdUser.isSeller,
      hasAd: createdUser.hasAd,
      referer: createdUser.referer,
      newsletter: isNewsletterSubscribed,
      verified: createdUser.verify.verified,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { message: 'Errore nella registrazione' },
      { status: 500 }
    );
  }
}
