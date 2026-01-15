import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongoose';
import OrderModel from '@/lib/db/models/Order';
import UserModel from '@/lib/db/models/User';
import { authOptions } from '@/lib/auth/config';
import { releaseFromEscrow } from '@/lib/services/blockchain';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT /api/orders/[id]/deliver - Mark order as delivered
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

    // Update delivery status
    order.isDelivered = true;
    order.deliveredAt = new Date();

    let escrowReleaseTxHash: string | undefined;

    // Release tokens from escrow to seller if paid with Valazco
    if (order.valPayment === 'completed' && order.seller) {
      const seller = await UserModel.findById(order.seller);

      if (seller?.account) {
        // Convert price to token amount (totalPriceVal is in VLZ, token has 2 decimals)
        // So 1 VLZ = 100 in token units
        const amount = BigInt(Math.round(order.totalPriceVal * 100));

        const result = await releaseFromEscrow(
          seller.account as `0x${string}`,
          amount
        );

        if (result.success) {
          escrowReleaseTxHash = result.txHash;
          console.log(`Released ${order.totalPriceVal} VLZ to seller ${seller.account}, tx: ${result.txHash}`);
        } else {
          console.error(`Failed to release escrow: ${result.error}`);
          // Continue with delivery even if escrow release fails - can be retried
        }
      }
    }

    const updatedOrder = await order.save();

    return NextResponse.json({
      message: 'Order Delivered',
      order: updatedOrder,
      escrowReleaseTxHash,
    });
  } catch (error) {
    console.error('Error updating order delivery:', error);
    return NextResponse.json(
      { message: 'Errore nell\'aggiornamento consegna' },
      { status: 500 }
    );
  }
}
