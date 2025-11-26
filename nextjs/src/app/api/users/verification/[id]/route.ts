import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import UserModel from '@/lib/db/models/User';
import NewsletterModel from '@/lib/db/models/Newsletter';
import { sendWelcomeEmail } from '@/lib/services/email';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/users/verification/[id] - Verify user account
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { uuid } = body;

    // Use uuid from body or id from params
    const verificationId = uuid || id;

    if (!verificationId) {
      return NextResponse.json(
        { message: 'ID di verifica mancante' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await UserModel.findOne({ 'verify.trusted_link': verificationId });

    if (!user) {
      return NextResponse.json(
        { message: 'Link di verifica non valido' },
        { status: 404 }
      );
    }

    if (user.verify.verified) {
      return NextResponse.json(
        { message: 'Il processo di verifica può essere eseguito solo una volta.' },
        { status: 400 }
      );
    }

    // Mark user as verified
    user.verify.verified = true;
    await user.save();

    // Check newsletter status
    const newsletter = await NewsletterModel.findOne({ email: user.email });
    const isNewsletterSubscribed = newsletter?.verified || false;

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.username, isNewsletterSubscribed);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      uuid: verificationId,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Error in verification:', error);
    return NextResponse.json(
      { message: 'Errore nel processo di verifica' },
      { status: 500 }
    );
  }
}
