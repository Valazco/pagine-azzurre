import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongoose';
import UserModel from '@/lib/db/models/User';
import { authOptions } from '@/lib/auth/config';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT /api/users/upgrade/[id] - Upgrade user to hasAd (authenticated)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 });
    }

    await connectDB();

    // User can only upgrade their own account
    const user = await UserModel.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ message: 'Utente non trovato' }, { status: 404 });
    }

    if (user.hasAd) {
      return NextResponse.json(
        { message: 'Utente già aggiornato' },
        { status: 400 }
      );
    }

    user.hasAd = true;
    const upgradedUser = await user.save();

    return NextResponse.json({
      _id: upgradedUser._id.toString(),
      account: upgradedUser.account,
      username: upgradedUser.username,
      name: upgradedUser.name,
      surname: upgradedUser.surname,
      birthday: upgradedUser.birthday,
      birthplace: upgradedUser.birthplace,
      gender: upgradedUser.gender,
      cf: upgradedUser.cf,
      city: upgradedUser.city,
      zipCode: upgradedUser.zipCode,
      phone: upgradedUser.phone,
      email: upgradedUser.email,
      referer: upgradedUser.referer,
      isAdmin: upgradedUser.isAdmin,
      isSeller: upgradedUser.isSeller,
      hasAd: upgradedUser.hasAd,
      verified: upgradedUser.verify.verified,
    });
  } catch (error) {
    console.error('Error upgrading user:', error);
    return NextResponse.json(
      { message: 'Errore nell\'aggiornamento utente' },
      { status: 500 }
    );
  }
}
