import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongoose';
import ProductModel from '@/lib/db/models/Product';
import { authOptions } from '@/lib/auth/config';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/products/[id]/reviews - Add review to product
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, rating, comment } = body;

    if (!name || !rating || !comment) {
      return NextResponse.json(
        { message: 'Nome, rating e commento sono richiesti' },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await ProductModel.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: 'Prodotto non trovato' },
        { status: 404 }
      );
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find((r) => r.name === name);
    if (existingReview) {
      return NextResponse.json(
        { message: 'Hai già creato una recensione per questo articolo' },
        { status: 400 }
      );
    }

    // Add review
    const review = {
      name,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

    const updatedProduct = await product.save();
    const newReview = updatedProduct.reviews[updatedProduct.reviews.length - 1];

    return NextResponse.json(
      {
        message: 'Review Created',
        review: newReview,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { message: 'Errore nella creazione recensione' },
      { status: 500 }
    );
  }
}

// GET /api/products/[id]/reviews - Get all reviews for a product
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await connectDB();

    const product = await ProductModel.findById(id).select('reviews rating numReviews');

    if (!product) {
      return NextResponse.json(
        { message: 'Prodotto non trovato' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      reviews: product.reviews,
      rating: product.rating,
      numReviews: product.numReviews,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { message: 'Errore nel recupero recensioni' },
      { status: 500 }
    );
  }
}
