import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import NewsletterModel from '@/lib/db/models/Newsletter';

// POST /api/users/newsletter-update - Toggle newsletter subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email richiesta' },
        { status: 400 }
      );
    }

    await connectDB();

    const subscriber = await NewsletterModel.findOne({ email: email.toLowerCase() });

    if (subscriber) {
      // Toggle verification status
      subscriber.verified = !subscriber.verified;
      await subscriber.save();

      return NextResponse.json({
        verified: subscriber.verified,
        message: subscriber.verified ? 'Iscrizione attivata' : 'Iscrizione disattivata',
      });
    } else {
      // Create new subscription
      const newSubscriber = new NewsletterModel({
        name: username || undefined,
        email: email.toLowerCase(),
        verified: true,
      });
      await newSubscriber.save();

      return NextResponse.json({
        verified: true,
        message: 'Iscrizione attivata',
      });
    }
  } catch (error) {
    console.error('Error updating newsletter:', error);
    return NextResponse.json(
      { message: 'Errore nell\'aggiornamento newsletter' },
      { status: 500 }
    );
  }
}
