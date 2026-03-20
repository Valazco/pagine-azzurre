import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import NewsletterModel from '@/lib/db/models/Newsletter';

// PATCH /api/users/newsletter - Toggle newsletter subscription
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email richiesta' },
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

    await connectDB();

    const existingSubscriber = await NewsletterModel.findOne({ email: email.toLowerCase() });

    if (existingSubscriber) {
      // Toggle verified status
      existingSubscriber.verified = !existingSubscriber.verified;
      await existingSubscriber.save();

      return NextResponse.json({
        subscribed: existingSubscriber.verified,
      });
    }

    // Create new subscriber if doesn't exist
    const subscriber = new NewsletterModel({
      name: username || undefined,
      email: email.toLowerCase(),
      verified: true,
    });

    await subscriber.save();

    return NextResponse.json({
      subscribed: true,
    });
  } catch (error) {
    console.error('Error updating newsletter subscription:', error);
    return NextResponse.json(
      { message: 'Errore nell\'aggiornamento della newsletter' },
      { status: 500 }
    );
  }
}
