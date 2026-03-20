import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import UserModel from '@/lib/db/models/User';
import NewsletterModel from '@/lib/db/models/Newsletter';
import { sendWelcomeEmail } from '@/lib/services/email';
import { mintTokens, fundUserGas } from '@/lib/services/blockchain';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/users/verification/[id] - Verify user account
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Handle empty or missing body gracefully
    let uuid: string | undefined;
    try {
      const body = await request.json();
      uuid = body.uuid;
    } catch {
      // Body is empty or invalid JSON - use id from params
    }

    // Use uuid from body or id from params
    const verificationId = uuid || id;

    if (!verificationId) {
      return NextResponse.json(
        { message: 'ID di verifica mancante' },
        { status: 400 }
      );
    }

    await connectDB();

    // Use atomic findOneAndUpdate to prevent race conditions
    // Only update if verified is false, preventing duplicate verifications
    const user = await UserModel.findOneAndUpdate(
      {
        'verify.trusted_link': verificationId,
        'verify.verified': false, // Only match if not already verified
      },
      {
        $set: { 'verify.verified': true },
      },
      {
        new: true, // Return the updated document
      }
    );

    if (!user) {
      // Check if user exists but is already verified
      const existingUser = await UserModel.findOne({ 'verify.trusted_link': verificationId });

      if (existingUser?.verify?.verified) {
        return NextResponse.json(
          { message: 'Il processo di verifica può essere eseguito solo una volta.' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: 'Link di verifica non valido' },
        { status: 404 }
      );
    }

    // Check newsletter status
    const newsletter = await NewsletterModel.findOne({ email: user.email });
    const isNewsletterSubscribed = newsletter?.verified || false;

    // Mint 100 Valazco tokens and fund gas as verification reward
    let mintResult: { success: boolean; txHash?: string; error?: string } = { success: false };
    let gasResult: { success: boolean; txHash?: string; error?: string } = { success: false };
    if (user.account) {
      try {
        // Mint VLZ tokens
        mintResult = await mintTokens(user.account as `0x${string}`);
        if (mintResult.success) {
          console.log(`Minted 100 VLZ to ${user.account}, tx: ${mintResult.txHash}`);
        } else {
          console.error('Failed to mint tokens:', mintResult.error);
        }

        // Fund ETH for gas
        gasResult = await fundUserGas(user.account as `0x${string}`);
        if (gasResult.success) {
          console.log(`Funded 0.01 ETH for gas to ${user.account}, tx: ${gasResult.txHash}`);
        } else {
          console.error('Failed to fund gas:', gasResult.error);
        }
      } catch (mintError) {
        console.error('Error minting verification reward:', mintError);
      }
    }

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
      tokensMinted: mintResult.success,
      mintTxHash: mintResult.txHash,
      gasFunded: gasResult.success,
      gasTxHash: gasResult.txHash,
    });
  } catch (error) {
    console.error('Error in verification:', error);
    return NextResponse.json(
      { message: 'Errore nel processo di verifica' },
      { status: 500 }
    );
  }
}
