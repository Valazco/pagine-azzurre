import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import UserModel from '../src/lib/db/models/User';
import ProductModel from '../src/lib/db/models/Product';

const MONGODB_URL = 'mongodb://localhost:27017/pagineazzurre';

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URL);
  console.log('Connected!');

  // Clear existing data
  console.log('Clearing existing data...');
  await UserModel.deleteMany({});
  await ProductModel.deleteMany({});

  // Create 2 users
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await UserModel.create({
    account: '0x1234567890abcdef1234567890abcdef12345678',
    accountKey: 'key_user1_' + Date.now(),
    username: 'MARIO_ROSSI',
    name: 'Mario',
    surname: 'Rossi',
    email: 'mario@example.com',
    city: 'ROMA',
    zipCode: '00100',
    phone: '+39123456789',
    password: hashedPassword,
    isAdmin: true,
    isSeller: true,
    hasAd: false,
    activity: 10,
    inscriptionBlock: 0,
    verify: {
      verified: true,
      trusted_link: 'https://example.com/mario',
    },
    seller: {
      name: 'Mario Shop',
      link: 'https://marioshop.com',
      logo: '/images/mario-logo.png',
      description: 'La bottega di Mario - prodotti artigianali italiani',
      rating: 4.5,
      numReviews: 25,
    },
  });

  const user2 = await UserModel.create({
    account: '0xabcdef1234567890abcdef1234567890abcdef12',
    accountKey: 'key_user2_' + Date.now(),
    username: 'GIULIA_BIANCHI',
    name: 'Giulia',
    surname: 'Bianchi',
    email: 'giulia@example.com',
    city: 'MILANO',
    zipCode: 20100,
    phone: '+39987654321',
    password: hashedPassword,
    isAdmin: false,
    isSeller: true,
    hasAd: true,
    activity: 5,
    inscriptionBlock: 0,
    verify: {
      verified: true,
    },
    seller: {
      name: 'Giulia Creazioni',
      description: 'Creazioni handmade con amore',
      rating: 4.8,
      numReviews: 42,
    },
  });

  console.log('Users created:', user1.username, user2.username);

  // Create products
  console.log('Creating products...');

  const products = await ProductModel.insertMany([
    {
      name: 'Olio Extra Vergine di Oliva Biologico',
      seller: user1._id,
      image: ['/images/products/olio-1.jpg', '/images/products/olio-2.jpg'],
      brand: 'MARIO FARM',
      category: 'ALIMENTARI',
      description: 'Olio extra vergine di oliva biologico, spremuto a freddo. Prodotto nelle colline toscane con olive raccolte a mano.',
      priceVal: 15,
      priceEuro: 25,
      countInStock: 50,
      rating: 4.7,
      numReviews: 18,
      section: 'offro',
      isService: false,
      isGift: false,
      delivery: 'spedizione',
      city: 'FIRENZE',
      country: 'Italia',
      state: 'Toscana',
    },
    {
      name: 'Corso di Cucina Italiana Online',
      seller: user1._id,
      image: ['/images/products/corso-cucina.jpg'],
      category: 'CORSI',
      description: 'Impara a cucinare i piatti della tradizione italiana con un corso online di 10 lezioni.',
      priceVal: 50,
      priceEuro: 80,
      countInStock: 999,
      rating: 4.9,
      numReviews: 32,
      section: 'offro',
      isService: true,
      isGift: false,
      delivery: 'digitale',
      city: 'ROMA',
      country: 'Italia',
    },
    {
      name: 'Borsa Artigianale in Pelle',
      seller: user2._id,
      image: ['/images/products/borsa-1.jpg', '/images/products/borsa-2.jpg'],
      brand: 'GIULIA CREAZIONI',
      category: 'MODA',
      description: 'Borsa realizzata a mano in vera pelle italiana. Ogni pezzo e unico.',
      priceVal: 80,
      priceEuro: 150,
      countInStock: 5,
      rating: 5.0,
      numReviews: 8,
      section: 'offro',
      isService: false,
      isGift: false,
      delivery: 'spedizione',
      city: 'MILANO',
      country: 'Italia',
      state: 'Lombardia',
    },
    {
      name: 'Ceramica Decorata a Mano',
      seller: user2._id,
      image: ['/images/products/ceramica.jpg'],
      brand: 'GIULIA CREAZIONI',
      category: 'CASA',
      description: 'Set di 4 piatti decorati a mano con motivi tradizionali siciliani.',
      priceVal: 40,
      priceEuro: 65,
      countInStock: 12,
      rating: 4.6,
      numReviews: 15,
      section: 'offro',
      isService: false,
      isGift: false,
      delivery: 'ritiro',
      city: 'MILANO',
      country: 'Italia',
    },
    {
      name: 'Cerco Collaboratore per E-commerce',
      seller: user1._id,
      image: ['/images/products/lavoro.jpg'],
      category: 'LAVORO',
      description: 'Cerco collaboratore esperto in e-commerce per gestione ordini e spedizioni.',
      priceVal: 0,
      countInStock: 1,
      rating: 0,
      numReviews: 0,
      section: 'cerco',
      isService: true,
      isGift: false,
      city: 'ROMA',
      country: 'Italia',
    },
    {
      name: 'Regalo Libri Usati',
      seller: user2._id,
      image: ['/images/products/libri.jpg'],
      category: 'LIBRI',
      description: 'Regalo collezione di libri usati in buone condizioni. Ritiro in zona Milano.',
      priceVal: 0,
      countInStock: 1,
      rating: 0,
      numReviews: 0,
      section: 'offro',
      isService: false,
      isGift: true,
      delivery: 'ritiro',
      city: 'MILANO',
      country: 'Italia',
    },
  ]);

  console.log(`Created ${products.length} products`);

  // Summary
  console.log('\n=== SEED COMPLETED ===');
  console.log('\nUsers:');
  console.log(`  - ${user1.email} (password: password123) - Admin`);
  console.log(`  - ${user2.email} (password: password123)`);
  console.log(`\nProducts: ${products.length} created`);

  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB');
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
