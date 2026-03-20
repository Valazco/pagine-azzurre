import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import UserModel from '@/lib/db/models/User';

// GET /api/users/top-sellers - Get top 3 sellers by rating (public)
export async function GET() {
  try {
    await connectDB();

    const topSellers = await UserModel.find({ isSeller: true })
      .sort({ 'seller.rating': -1 })
      .limit(3);

    // Sanitize sensitive fields using toJSON
    const sanitizedSellers = topSellers.map((seller) => seller.toJSON());

    return NextResponse.json(sanitizedSellers);
  } catch (error) {
    console.error('Error fetching top sellers:', error);
    return NextResponse.json(
      { message: 'Errore nel recupero top venditori' },
      { status: 500 }
    );
  }
}
