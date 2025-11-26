import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongoose';
import OrderModel from '@/lib/db/models/Order';
import { authOptions } from '@/lib/auth/config';

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

    // Update payment status
    order.isPaid = true;
    order.paidAt = new Date();

    // Optionally update payment result from body (for PayPal, etc.)
    const body = await request.json().catch(() => ({}));
    if (body.id || body.status) {
      order.paymentResult = {
        id: body.id,
        status: body.status,
        update_time: body.update_time,
        email_address: body.email_address,
      };
    }

    // Update valPayment if txHash provided (blockchain payment)
    if (body.txHash) {
      order.valPayment = 'completed';
    }

    const updatedOrder = await order.save();

    return NextResponse.json({
      message: 'Order Paid',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order payment:', error);
    return NextResponse.json(
      { message: 'Errore nell\'aggiornamento pagamento' },
      { status: 500 }
    );
  }
}
