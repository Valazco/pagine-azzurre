import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongoose';
import OrderModel from '@/lib/db/models/Order';
import UserModel from '@/lib/db/models/User';
import { authOptions } from '@/lib/auth/config';
import { sendOrderMailingToOfferer } from '@/lib/services/email';

// POST /api/orders/mailing - Send email to seller about order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 });
    }

    const body = await request.json();
    const { order, buyer, emailBody } = body;

    if (!order?._id || !order?.seller) {
      return NextResponse.json(
        { message: 'Dati ordine mancanti' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get seller info
    const seller = await UserModel.findById(order.seller);
    if (!seller) {
      return NextResponse.json(
        { message: 'Venditore non trovato' },
        { status: 404 }
      );
    }

    // Verify order exists
    const existingOrder = await OrderModel.findById(order._id);
    if (!existingOrder) {
      return NextResponse.json(
        { message: 'Ordine non trovato' },
        { status: 404 }
      );
    }

    // Build order items string
    const orderNames = order.orderItems
      ?.map((item: { name: string }) => item.name)
      .join(', ') || '';

    // Send email
    try {
      await sendOrderMailingToOfferer(
        seller.email,
        seller.name || seller.username,
        buyer?.name || 'Acquirente',
        orderNames,
        emailBody || ''
      );
    } catch (emailError) {
      console.error('Error sending mailing email:', emailError);
      return NextResponse.json(
        { message: 'Errore nell\'invio email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { mailStatus: 'Mail Sent.', resp_code: 1 },
      { status: 202 }
    );
  } catch (error) {
    console.error('Error in order mailing:', error);
    return NextResponse.json(
      { message: 'Errore nell\'invio comunicazione' },
      { status: 500 }
    );
  }
}
