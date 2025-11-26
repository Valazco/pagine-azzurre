import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongoose';
import OrderModel from '@/lib/db/models/Order';
import { authOptions } from '@/lib/auth/config';

// GET /api/orders - Get all orders (seller/admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 });
    }

    if (!session.user.isSeller && !session.user.isAdmin) {
      return NextResponse.json(
        { message: 'Solo venditori e admin possono vedere tutti gli ordini' },
        { status: 403 }
      );
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const seller = searchParams.get('seller') || '';
    const sellerFilter = seller ? { seller } : {};

    const orders = await OrderModel.find({ ...sellerFilter }).populate('user', 'name');

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { message: 'Errore nel recupero ordini' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.orderItems || body.orderItems.length === 0) {
      return NextResponse.json(
        { message: 'Il carrello è vuoto' },
        { status: 400 }
      );
    }

    await connectDB();

    const order = new OrderModel({
      seller: body.orderItems[0].seller,
      orderItems: body.orderItems,
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod,
      itemsPriceVal: body.itemsPriceVal,
      itemsPriceEuro: body.itemsPriceEuro,
      totalPriceVal: body.totalPriceVal,
      totalPriceEuro: body.totalPriceEuro,
      shippingPrice: body.shippingPrice,
      user: session.user.id,
    });

    const createdOrder = await order.save();

    return NextResponse.json(
      { message: 'New Order Created', order: createdOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { message: 'Errore nella creazione ordine' },
      { status: 500 }
    );
  }
}
