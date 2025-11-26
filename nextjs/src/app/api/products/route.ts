import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongoose';
import ProductModel from '@/lib/db/models/Product';
import { authOptions } from '@/lib/auth/config';
import { extractCity } from '@/lib/utils/cities';

// GET /api/products - Search products with filters
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const pageSize = 100;
    const page = Number(searchParams.get('pageNumber')) || 1;
    const name = searchParams.get('name') || '';
    const category = searchParams.get('category') || '';
    const seller = searchParams.get('seller') || '';
    const order = searchParams.get('order') || '';
    const min = Number(searchParams.get('min')) || 0;
    const max = Number(searchParams.get('max')) || 0;
    const rating = Number(searchParams.get('rating')) || 0;

    // Extract city from search query
    const { city, cleanQuery } = extractCity(name);

    // Build filters
    const nameFilter = name
      ? { name: { $regex: cleanQuery.trim(), $options: 'i' } }
      : { name: { $not: { $regex: 'Annunciø' } } };

    const literalFilter = name
      ? { name: { $regex: name, $options: 'i' } }
      : {};

    const sellerFilter = seller ? { seller } : {};
    const categoryFilter = category ? { category: category.toUpperCase() } : {};
    const priceFilter = min && max ? { priceVal: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const cityFilter = city ? { city } : {};

    // Sort order
    type SortOrder = { [key: string]: 1 | -1 };
    let sortOrder: SortOrder;
    switch (order) {
      case 'lowest':
        sortOrder = { priceVal: 1 };
        break;
      case 'highest':
        sortOrder = { priceVal: -1 };
        break;
      case 'toprated':
        sortOrder = { rating: -1 };
        break;
      default:
        sortOrder = { _id: -1 };
    }

    // Build query
    const query = {
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    };

    // Count total documents
    const count = await ProductModel.countDocuments(query);

    // Find products
    let products = await ProductModel.find(query)
      .populate('seller', 'seller.name seller.logo')
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    // If searching with city, filter results
    if (name && city) {
      const literalProducts = await ProductModel.find({
        ...sellerFilter,
        ...literalFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
      })
        .populate('seller', 'seller.name seller.logo')
        .sort(sortOrder)
        .skip(pageSize * (page - 1))
        .limit(pageSize);

      // Filter products by city
      const filteredIds = new Set<string>();
      const cityFilteredProducts = products.filter((product) => {
        if (product.city === city) {
          return true;
        }
        return false;
      });

      // Add literal matches that weren't in city-filtered results
      for (const literalProduct of literalProducts) {
        const productId = literalProduct._id.toString();
        const existsInFiltered = cityFilteredProducts.some(
          (p) => p._id.toString() === productId
        );
        if (!existsInFiltered && !filteredIds.has(productId)) {
          cityFilteredProducts.unshift(literalProduct);
          filteredIds.add(productId);
        }
      }

      products = cityFilteredProducts;
    }

    return NextResponse.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Errore nel recupero prodotti' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product (seller/admin only)
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 });
    }

    if (!session.user.isSeller && !session.user.isAdmin) {
      return NextResponse.json(
        { message: 'Solo i venditori possono creare prodotti' },
        { status: 403 }
      );
    }

    await connectDB();

    // Create product with default values
    const product = new ProductModel({
      name: 'Annunciø n° ' + Date.now(),
      seller: session.user.id,
      image: ['/images/offro_prodotto.jpg'],
      rating: 0,
      isService: false,
      numReviews: 0,
    });

    const createdProduct = await product.save();

    return NextResponse.json({
      message: 'Product Created',
      product: createdProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'Errore nella creazione prodotto' },
      { status: 500 }
    );
  }
}
