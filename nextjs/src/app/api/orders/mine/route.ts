import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongoose';
import OrderModel from '@/lib/db/models/Order';
import { authOptions } from '@/lib/auth/config';

// GET /api/orders/mine - Get current user's orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 });
    }

    await connectDB();

    const orders = await OrderModel.find({ user: session.user.id });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { message: 'Errore nel recupero ordini' },
      { status: 500 }
    );
  }
}
