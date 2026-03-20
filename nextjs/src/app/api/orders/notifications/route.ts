import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongoose';
import UserModel from '@/lib/db/models/User';
import { authOptions } from '@/lib/auth/config';
import {
  sendOrderNotificationToOfferer,
  sendOrderNotificationToBuyer,
} from '@/lib/services/email';

// POST /api/orders/notifications - Send order notifications to buyer and seller
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 });
    }

    const body = await request.json();
    const { seller: sellerId, orderItems, totalPriceVal, shippingAddress } = body;

    if (!sellerId || !orderItems) {
      return NextResponse.json(
        { message: 'Dati ordine mancanti' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get buyer info
    const buyer = await UserModel.findOne({ email: session.user.email });
    if (!buyer) {
      return NextResponse.json(
        { message: 'Acquirente non trovato' },
        { status: 404 }
      );
    }

    // Get seller info
    const offerer = await UserModel.findById(sellerId);
    if (!offerer) {
      return NextResponse.json(
        { message: 'Venditore non trovato' },
        { status: 404 }
      );
    }

    // Build order items string
    const orderItemsString = orderItems
      .map((item: { name: string }) => item.name)
      .join(', ');

    // Build shipping address string
    const addressString = shippingAddress
      ? `${shippingAddress.fullName}, ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`
      : 'Non specificato';

    const notificationData = {
      offererEmail: offerer.email,
      offererName: offerer.name || offerer.username,
      buyerEmail: buyer.email,
      buyerName: buyer.name || buyer.username,
      orderItems: orderItemsString,
      totalPrice: totalPriceVal || 0,
      shippingAddress: addressString,
    };

    // Send notifications
    try {
      await sendOrderNotificationToOfferer(notificationData);
      await sendOrderNotificationToBuyer(notificationData);
    } catch (emailError) {
      console.error('Error sending notification emails:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json(
      { mailStatus: 'Mail Sent.', resp_code: 2 },
      { status: 202 }
    );
  } catch (error) {
    console.error('Error in order notifications:', error);
    return NextResponse.json(
      { message: 'Errore nell\'invio notifiche' },
      { status: 500 }
    );
  }
}
