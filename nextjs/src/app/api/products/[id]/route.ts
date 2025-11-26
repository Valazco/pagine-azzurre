import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongoose';
import ProductModel from '@/lib/db/models/Product';
import { authOptions } from '@/lib/auth/config';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/products/[id] - Get product by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await connectDB();

    const product = await ProductModel.findById(id).populate(
      'seller',
      'seller.name seller.logo seller.rating seller.numReviews'
    );

    if (!product) {
      return NextResponse.json(
        { message: 'Prodotto non trovato' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: 'Errore nel recupero prodotto' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product (seller/admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 });
    }

    if (!session.user.isSeller && !session.user.isAdmin) {
      return NextResponse.json(
        { message: 'Solo i venditori possono modificare prodotti' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    await connectDB();

    const product = await ProductModel.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: 'Prodotto non trovato' },
        { status: 404 }
      );
    }

    // Check if user owns the product or is admin
    if (product.seller.toString() !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json(
        { message: 'Non autorizzato a modificare questo prodotto' },
        { status: 403 }
      );
    }

    // Handle default images based on section
    const defaultImage = '/images/offro_prodotto.jpg';
    if (body.image?.[0] === defaultImage || !body.image?.length) {
      switch (body.section) {
        case 'offro':
          product.image = body.isService
            ? ['/images/offro_servizio.jpg']
            : ['/images/offro_prodotto.jpg'];
          break;
        case 'cerco':
          product.image = body.isService
            ? ['/images/cerco_servizio.jpg']
            : ['/images/cerco_prodotto.jpg'];
          break;
        case 'avviso':
          product.image = ['/images/avviso.jpg'];
          break;
        case 'propongo':
          product.image = ['/images/propongo.jpg'];
          break;
        default:
          product.image = body.image || product.image;
      }
    } else {
      product.image = body.image;
    }

    // Update fields
    product.name = body.name ?? product.name;
    product.priceVal = body.priceVal ?? product.priceVal;
    product.priceEuro = body.priceEuro ?? product.priceEuro;
    product.category = body.category ?? product.category;
    product.brand = body.brand ?? product.brand;
    product.countInStock = body.countInStock ?? product.countInStock;
    product.description = body.description ?? product.description;
    product.section = body.section ?? product.section;
    product.isService = body.isService ?? product.isService;
    product.pause = body.pause ?? product.pause;
    product.isGift = body.isGift ?? product.isGift;
    product.auxPhone = body.auxPhone ?? product.auxPhone;
    product.delivery = body.delivery ?? product.delivery;
    product.expiry = body.expiry ?? product.expiry;
    product.country = body.country ?? product.country;
    product.state = body.state ?? product.state;
    product.city = body.city ?? product.city;
    product.municipality = body.municipality ?? product.municipality;

    const updatedProduct = await product.save();

    return NextResponse.json({
      message: 'Product Updated',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: 'Errore nell\'aggiornamento prodotto' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product (seller/admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 });
    }

    if (!session.user.isSeller && !session.user.isAdmin) {
      return NextResponse.json(
        { message: 'Solo i venditori possono eliminare prodotti' },
        { status: 403 }
      );
    }

    const { id } = await params;

    await connectDB();

    const product = await ProductModel.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: 'Prodotto non trovato' },
        { status: 404 }
      );
    }

    // Check if user owns the product or is admin
    if (product.seller.toString() !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json(
        { message: 'Non autorizzato a eliminare questo prodotto' },
        { status: 403 }
      );
    }

    await ProductModel.findByIdAndDelete(id);

    return NextResponse.json({
      message: 'Product Deleted',
      product,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: 'Errore nell\'eliminazione prodotto' },
      { status: 500 }
    );
  }
}
