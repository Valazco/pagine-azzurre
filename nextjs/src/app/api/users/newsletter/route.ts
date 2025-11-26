import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import NewsletterModel from '@/lib/db/models/Newsletter';
import { sendNewsletterWelcomeEmail } from '@/lib/services/email';

// POST /api/users/newsletter - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

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
      if (existingSubscriber.verified) {
        return NextResponse.json(
          { message: 'Email già iscritta' },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { message: 'Email già iscritta ma non verificata' },
          { status: 400 }
        );
      }
    }

    // Create new subscriber
    const subscriber = new NewsletterModel({
      name: name || undefined,
      email: email.toLowerCase(),
      verified: false,
    });

    await subscriber.save();

    // Send welcome email
    try {
      await sendNewsletterWelcomeEmail(email, name);
    } catch (emailError) {
      console.error('Error sending newsletter welcome email:', emailError);
      return NextResponse.json(
        { message: 'Errore nell\'invio email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subscriber: true,
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { message: 'Errore nell\'iscrizione alla newsletter' },
      { status: 500 }
    );
  }
}
