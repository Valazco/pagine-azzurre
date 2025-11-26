import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongoose';
import OrderModel from '@/lib/db/models/Order';
import { authOptions } from '@/lib/auth/config';

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

    const updatedOrder = await order.save();

    return NextResponse.json({
      message: 'Order Delivered',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order delivery:', error);
    return NextResponse.json(
      { message: 'Errore nell\'aggiornamento consegna' },
      { status: 500 }
    );
  }
}
