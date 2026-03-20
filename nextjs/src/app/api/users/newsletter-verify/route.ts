import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import NewsletterModel from '@/lib/db/models/Newsletter';

// POST /api/users/newsletter-verify - Verify newsletter subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email richiesta' },
        { status: 400 }
      );
    }

    await connectDB();

    const subscriber = await NewsletterModel.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      return NextResponse.json(
        { message: 'Email non trovata' },
        { status: 404 }
      );
    }

    if (subscriber.verified) {
      return NextResponse.json(
        { message: 'Email già verificata' },
        { status: 400 }
      );
    }

    subscriber.verified = true;
    await subscriber.save();

    return NextResponse.json({
      name: subscriber.name,
      verified: true,
    });
  } catch (error) {
    console.error('Error verifying newsletter:', error);
    return NextResponse.json(
      { message: 'Errore nella verifica newsletter' },
      { status: 500 }
    );
  }
}
