import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import NewsletterModel from '@/lib/db/models/Newsletter';

interface RouteParams {
  params: Promise<{ email: string }>;
}

// GET /api/users/newsletter/[email] - Check newsletter subscription status
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { email } = await params;

    if (!email) {
      return NextResponse.json(
        { message: 'Email richiesta' },
        { status: 400 }
      );
    }

    await connectDB();

    const subscriber = await NewsletterModel.findOne({ email: decodeURIComponent(email).toLowerCase() });

    if (!subscriber) {
      return NextResponse.json({
        subscribed: false,
        verified: false,
      });
    }

    return NextResponse.json({
      subscribed: true,
      verified: subscriber.verified,
    });
  } catch (error) {
    console.error('Error checking newsletter status:', error);
    return NextResponse.json(
      { message: 'Errore nel controllo stato newsletter' },
      { status: 500 }
    );
  }
}
