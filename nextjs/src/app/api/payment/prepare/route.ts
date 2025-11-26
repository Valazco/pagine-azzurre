import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongoose';
import UserModel from '@/lib/db/models/User';
import OrderModel from '@/lib/db/models/Order';
import { authOptions } from '@/lib/auth/config';

// POST /api/payment/prepare - Prepare payment data for client-side transaction
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, items } = body;

    if (!orderId && !items) {
      return NextResponse.json(
        { message: 'ID ordine o articoli richiesti' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get buyer info
    const buyer = await UserModel.findById(session.user.id);
    if (!buyer) {
      return NextResponse.json(
        { message: 'Acquirente non trovato' },
        { status: 404 }
      );
    }

    let sellerId: string;
    let totalVals: number;

    if (orderId) {
      // Get order info
      const order = await OrderModel.findById(orderId);
      if (!order) {
        return NextResponse.json(
          { message: 'Ordine non trovato' },
          { status: 404 }
        );
      }
      sellerId = order.seller?.toString() || '';
      totalVals = order.totalPriceVal;
    } else {
      // Calculate from items
      sellerId = items[0]?.seller?._id || items[0]?.seller;
      totalVals = items.reduce(
        (sum: number, item: { priceVal: number; qty: number }) =>
          sum + item.priceVal * item.qty,
        0
      );
    }

    if (!sellerId) {
      return NextResponse.json(
        { message: 'Venditore non trovato' },
        { status: 404 }
      );
    }

    // Get seller info
    const seller = await UserModel.findById(sellerId);
    if (!seller) {
      return NextResponse.json(
        { message: 'Venditore non trovato' },
        { status: 404 }
      );
    }

    // Return data for client-side Wagmi transaction
    // Amount is multiplied by 100 (as in original code) to handle decimals
    return NextResponse.json({
      contractAddress: process.env.TOKEN_CONTRACT_ADDRESS,
      recipientAddress: seller.account,
      amount: totalVals * 100,
      buyerAddress: buyer.account,
      // Don't expose private key - transactions are done client-side with user's wallet
    });
  } catch (error) {
    console.error('Error preparing payment:', error);
    return NextResponse.json(
      { message: 'Errore nella preparazione pagamento' },
      { status: 500 }
    );
  }
}
