import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import UserModel from '@/lib/db/models/User';

// GET /api/users/sellers - Get all sellers (public)
export async function GET() {
  try {
    await connectDB();

    const sellers = await UserModel.find({ isSeller: true });

    // Sanitize sensitive fields using toJSON
    const sanitizedSellers = sellers.map((seller) => seller.toJSON());

    return NextResponse.json(sanitizedSellers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return NextResponse.json(
      { message: 'Errore nel recupero venditori' },
      { status: 500 }
    );
  }
}
