import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';
import { citiesList } from '../utils.js';

const productRouter = express.Router();

productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    let city = []
    req.query.name.split(' ').forEach( word => {
      if(citiesList.includes(word)) {
        city.push(word)
      }
    })
    let query = req.query.name
    if(city.length > 0) {
      query = query.replace(city[0], '')
      city[0] = city[0].toUpperCase()
    }
    const pageSize = 100;
    const page = Number(req.query.pageNumber) || 1;
    const name = req.query.name || '';
    const category = req.query.category || '';
    const seller = req.query.seller || '';
    const order = req.query.order || '';
    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;

    const nameFilter = name ? { name: { $regex: query.trim(), $options: 'i' } } : {};
    const literalFilter = name ? { name: { $regex: req.query.name, $options: 'i' } } : {};
    const sellerFilter = seller ? { seller } : {};
    const categoryFilter = category ? { category } : {};
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const sortOrder =
      order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : { _id: -1 };
    const count = await Product.countDocuments({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    let products = await Product.find({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .populate('seller', 'seller.name seller.logo')
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const literal = await Product.find({
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
        
    var filtred = []
    if(name !== '' && literal.length > 0 && city.length > 0) {
      for(const i in literal){
        for(const y in products){
          if(JSON.stringify(products[y]._id) === JSON.stringify(literal[i]._id) ){
            filtred.unshift(JSON.stringify(literal[i]._id))
          }
          if(products[y].city != city[0]) {
            delete products[y]
          }
        }
      }
      console.log("filtred:", filtred)
      for(const i in literal){
        console.log(filtred.includes(JSON.stringify(literal[i]._id)))
        if(!filtred.includes(JSON.stringify(literal[i]._id))) products.unshift(literal[i])
      }
    }
    res.send({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

productRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({});
    const seller = await User.findOne({ isSeller: true });
    if (seller) {
      const products = data.products.map((product) => ({
        ...product,
        seller: seller._id,
      }));
      const createdProducts = await Product.insertMany(products);
      res.send({ createdProducts });
    } else {
      res
        .status(500)
        .send({ message: 'No seller found. first run /api/users/seed' });
    }
  })
);

productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate(
      'seller',
      'seller.name seller.logo seller.rating seller.numReviews'
    );
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.post(
  '/',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: 'Annunciø n° ' + Date.now(),
      seller: req.user._id,
      image: '/images/offro_prodotto.jpg',
      rating: 0,
      isService: false,
      numReviews: 0
    });
    const createdProduct = await product.save();
    res.send({ message: 'Product Created', product: createdProduct });
  })
);
productRouter.put(
  '/:id',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if(req.body.image[0] === ['/images/offro_prodotto.jpg'] && req.body.section === 'offro') {
        if (req.body.isService){
          product.image = ['/images/offro_servizio.jpg']
        } else {
          product.image = ['/images/offro_prodotto.jpg']
        }
      } else if (req.body.image[0] === ['/images/offro_prodotto.jpg'] && req.body.section === 'cerco') {
        if (req.body.isService){
          product.image = ['/images/cerco_servizio.jpg']
        } else {
          product.image = ['/images/cerco_prodotto.jpg']
        }
      } else if(req.body.image[0] === ['/images/offro_prodotto.jpg'] && req.body.section === 'avviso') {
        product.image = ['/images/avviso.jpg']
      } else if(req.body.image[0] === ['/images/offro_prodotto.jpg'] && req.body.section === 'propongo') {
        product.image = ['/images/propongo.jpg']
      } else {
        product.image = req.body.image
      }
      product.name = req.body.name;
      product.priceVal = req.body.priceVal;
      product.priceEuro = req.body.priceEuro;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      product.section = req.body.section;
      product.isService = req.body.isService;
      product.pause = req.body.pause;
      product.auxPhone = req.body.auxPhone;
      product.delivery = req.body.delivery;
      product.expiry = req.body.expiry;
      product.country = req.body.country;
      product.state = req.body.state;
      product.city = req.body.city;
      product.municipality = req.body.municipality;
      const updatedProduct = await product.save();
      res.send({ message: 'Product Updated', product: updatedProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.delete(
  '/:id',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    console.log("Trying to delete product")
    const product = await Product.findById(req.params.id);
    if (product) {
      const deleteProduct = await product.remove();
      console.log("Deleted product?", deleteProduct);
      res.send({ message: 'Product Deleted', product: deleteProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    console.log(req.body)
    if (product) {
      if (product.reviews.find((x) => x.name === req.body.name)) {
        return res
          .status(400)
          .send({ message: 'Hai già creato una recensione per questo articulo ' });
      }
      const review = {
        name: req.body.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

export default productRouter;
