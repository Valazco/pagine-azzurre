import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongoose';
import OrderModel from '@/lib/db/models/Order';
import UserModel from '@/lib/db/models/User';
import { authOptions } from '@/lib/auth/config';
import { transferToEscrow } from '@/lib/services/blockchain';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT /api/orders/[id]/pay - Mark order as paid
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const order = await OrderModel.findById(id);

    if (!order) {
      return NextResponse.json(
        { message: 'Ordine non trovato' },
        { status: 404 }
      );
    }

    // Check if already paid
    if (order.isPaid) {
      return NextResponse.json(
        { message: 'Ordine già pagato' },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    let escrowTxHash: string | undefined;

    // Handle Valazco token payment - automatic transfer to escrow
    if (order.paymentMethod === 'Valazco') {
      // Get buyer's wallet info
      const buyer = await UserModel.findById(order.user).select('+accountKey');

      if (!buyer?.accountKey) {
        return NextResponse.json(
          { message: 'Wallet del compratore non configurato' },
          { status: 400 }
        );
      }

      // Convert price to token amount (totalPriceVal is in VLZ, token has 2 decimals)
      const amount = BigInt(Math.round(order.totalPriceVal * 100));

      // Transfer tokens from buyer to escrow
      const result = await transferToEscrow(
        buyer.accountKey as `0x${string}`,
        amount
      );

      if (!result.success) {
        console.error('Escrow transfer failed:', result.error);
        return NextResponse.json(
          { message: result.error || 'Errore nel trasferimento al escrow' },
          { status: 400 }
        );
      }

      escrowTxHash = result.txHash;
      order.valPayment = 'completed';
      console.log(`Transferred ${order.totalPriceVal} VLZ to escrow, tx: ${escrowTxHash}`);
    }

    // Update payment status
    order.isPaid = true;
    order.paidAt = new Date();

    // Update payment result from body (for PayPal, etc.)
    if (body.id || body.status || escrowTxHash) {
      order.paymentResult = {
        id: body.id || escrowTxHash,
        status: body.status || 'completed',
        update_time: body.update_time || new Date().toISOString(),
        email_address: body.email_address,
      };
    }

    const updatedOrder = await order.save();

    return NextResponse.json({
      message: 'Order Paid',
      order: updatedOrder,
      escrowTxHash,
    });
  } catch (error) {
    console.error('Error updating order payment:', error);
    return NextResponse.json(
      { message: 'Errore nell\'aggiornamento pagamento' },
      { status: 500 }
    );
  }
}
