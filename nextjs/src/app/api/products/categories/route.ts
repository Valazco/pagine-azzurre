import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import ProductModel from '@/lib/db/models/Product';

// GET /api/products/categories - Get all product categories
export async function GET() {
  try {
    await connectDB();

    const categories = await ProductModel.find().distinct('category');

    // Filter out null/undefined and sort alphabetically
    const validCategories = categories
      .filter((cat): cat is string => cat != null && cat !== '')
      .sort();

    return NextResponse.json(validCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { message: 'Errore nel recupero categorie' },
      { status: 500 }
    );
  }
}
