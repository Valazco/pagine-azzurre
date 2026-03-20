import { NextRequest, NextResponse } from 'next/server';
import { keccak256, toBytes } from 'viem';
import connectDB from '@/lib/db/mongoose';
import UserModel from '@/lib/db/models/User';
import { sendPasswordRecoveryEmail } from '@/lib/services/email';

// POST /api/users/password-recovery - Request password recovery
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

    const user = await UserModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { message: 'Email non trovata' },
        { status: 404 }
      );
    }

    // Generate recovery ID using keccak256 hash of password
    const recoveryId = keccak256(toBytes(user.password));
    user.recoveryPasswordId = recoveryId;
    await user.save();

    // Send recovery email
    const recoveryLink = `${process.env.NEXTAUTH_URL}/password-recovery/${recoveryId}`;
    try {
      await sendPasswordRecoveryEmail(user.email, recoveryLink);
    } catch (emailError) {
      console.error('Error sending recovery email:', emailError);
      return NextResponse.json(
        { message: 'Errore nell\'invio email di recupero' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      email: true,
      loading: false,
    });
  } catch (error) {
    console.error('Error in password recovery:', error);
    return NextResponse.json(
      { message: 'Errore nel processo di recupero password' },
      { status: 500 }
    );
  }
}
