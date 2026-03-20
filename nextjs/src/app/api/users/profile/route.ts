import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db/mongoose';
import UserModel from '@/lib/db/models/User';
import { authOptions } from '@/lib/auth/config';

// GET /api/users/profile - Get current user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 });
    }

    await connectDB();

    const user = await UserModel.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ message: 'Utente non trovato' }, { status: 404 });
    }

    return NextResponse.json({
      _id: user._id.toString(),
      account: user.account,
      username: user.username,
      name: user.name,
      surname: user.surname,
      birthday: user.birthday,
      birthplace: user.birthplace,
      gender: user.gender,
      cf: user.cf,
      partitaIva: user.partitaIva,
      email: user.email,
      city: user.city,
      zipCode: user.zipCode,
      phone: user.phone,
      referer: user.referer,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
      hasAd: user.hasAd,
      verified: user.verify.verified,
      seller: user.isSeller
        ? {
            name: user.seller.name,
            link: user.seller.link,
            logo: user.seller.logo,
            description: user.seller.description,
            rating: user.seller.rating,
            numReviews: user.seller.numReviews,
          }
        : undefined,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { message: 'Errore nel recupero profilo' },
      { status: 500 }
    );
  }
}

// PUT /api/users/profile - Update current user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 });
    }

    const body = await request.json();

    await connectDB();

    const user = await UserModel.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ message: 'Utente non trovato' }, { status: 404 });
    }

    // Update allowed fields (email, username, account are not editable)
    user.name = body.name || user.name;
    user.surname = body.surname || user.surname;
    user.birthday = body.birthday || user.birthday;
    user.birthplace = body.birthplace || user.birthplace;
    user.gender = body.gender || user.gender;
    user.cf = body.cf || user.cf;
    user.city = body.city || user.city;
    user.zipCode = body.zipCode || user.zipCode;
    user.phone = body.phone || user.phone;
    user.referer = body.referer || user.referer;

    // Update seller info if user is a seller
    if (user.isSeller) {
      user.seller.name = body.sellerName || user.seller.name;
      user.seller.logo = body.sellerLogo || user.seller.logo;
      user.seller.description = body.sellerDescription || user.seller.description;
      user.seller.link = body.sellerLink || user.seller.link;
    }

    // Update password if provided
    if (body.password && body.password.length >= 6) {
      user.password = bcrypt.hashSync(body.password, 8);
    }

    const updatedUser = await user.save();

    return NextResponse.json({
      _id: updatedUser._id.toString(),
      account: updatedUser.account,
      username: updatedUser.username,
      name: updatedUser.name,
      surname: updatedUser.surname,
      birthday: updatedUser.birthday,
      birthplace: updatedUser.birthplace,
      gender: updatedUser.gender,
      cf: updatedUser.cf,
      email: updatedUser.email,
      city: updatedUser.city,
      zipCode: updatedUser.zipCode,
      phone: updatedUser.phone,
      referer: updatedUser.referer,
      isAdmin: updatedUser.isAdmin,
      isSeller: updatedUser.isSeller,
      hasAd: updatedUser.hasAd,
      verified: updatedUser.verify.verified,
      seller: updatedUser.isSeller
        ? {
            name: updatedUser.seller.name,
            link: updatedUser.seller.link,
            logo: updatedUser.seller.logo,
            description: updatedUser.seller.description,
          }
        : undefined,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Errore nell\'aggiornamento profilo' },
      { status: 500 }
    );
  }
}
