'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { getProduct, createProductReview } from '@/lib/api/products';
import { useUserStore } from '@/lib/store/user';
import { useCartStore } from '@/lib/store/cart';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import Rating from '@/components/ui/Rating';
import {
  Container,
  ThreeColumnGrid,
  SectionTitle,
  CardBase,
  StickyCard,
  PrimaryButton,
  FormGroup,
  Label,
  Select,
  Textarea,
  TextLink,
  LoadingContainer,
  ErrorContainer
} from '@/lib/styles';
import type { Product } from '@/types';

// Styled Components
const ProductGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const ImageGallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MainImage = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 1rem;
  overflow: hidden;
  background-color: #f3f4f6;
`;

const ThumbnailGrid = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
`;

const ThumbnailButton = styled.button<{ $active: boolean }>`
  position: relative;
  width: 5rem;
  height: 5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid ${({ $active }) => ($active ? '#2563eb' : 'transparent')};
  transition: all 0.2s;
  background: none;
  padding: 0;
  cursor: pointer;

  &:hover {
    border-color: #2563eb;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProductTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
`;

const PriceDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PriceEuro = styled.span`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
`;

const PriceVAL = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.25rem;
  color: #2563eb;
  font-weight: 600;
`;

const DescriptionSection = styled.div``;

const DescriptionTitle = styled.h3`
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const DescriptionText = styled.p`
  color: #6b7280;
  line-height: 1.625;
`;

const PurchaseCard = styled(StickyCard)``;

const SellerSection = styled.div`
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 1rem;
`;

const SellerLabel = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const SellerLink = styled(Link)`
  font-size: 1.125rem;
  font-weight: 600;
  color: #2563eb;

  &:hover {
    color: #1d4ed8;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InfoLabel = styled.span`
  color: #6b7280;
`;

const InfoValue = styled.div`
  text-align: right;
`;

const PriceValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
`;

const PriceSecondary = styled.span`
  display: block;
  color: #2563eb;
`;

const AvailabilityBadge = styled.span<{ $available: boolean }>`
  color: ${({ $available }) => ($available ? '#059669' : '#dc2626')};
  font-weight: 500;
`;

const ReviewsSection = styled.div`
  margin-top: 3rem;
`;

const ReviewCard = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  border: 1px solid #f3f4f6;
  margin-bottom: 1.5rem;
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const ReviewerName = styled.span`
  font-weight: 600;
  color: #111827;
`;

const ReviewDate = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ReviewComment = styled.p`
  margin-top: 0.5rem;
  color: #6b7280;
`;

const ReviewFormCard = styled.div`
  background-color: #f9fafb;
  border-radius: 0.75rem;
  padding: 1.5rem;
`;

const FormTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
`;

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  // Review state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const { userInfo } = useUserStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProduct(productId);
      setProduct(data);
    } catch {
      setError('Errore nel caricamento del prodotto');
    } finally {
      setLoading(false);
    }
  };

  const addToCartHandler = () => {
    if (!product) return;
    addToCart({
      product: product._id,
      name: product.name,
      image: product.image[0] || '/img-not-found.png',
      price: product.priceEuro,
      priceVal: product.priceVal,
      countInStock: product.countInStock,
      qty,
      seller: product.seller._id,
    });
    router.push('/cart');
  };

  const submitReviewHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!rating || !comment) {
      alert('Per favore lascia la tua valutazione e un commento');
      return;
    }

    try {
      setReviewLoading(true);
      setReviewError('');
      await createProductReview(productId, { rating, comment });
      alert('Recensione pubblicata con successo!');
      setRating(0);
      setComment('');
      fetchProduct();
    } catch {
      setReviewError('Errore nella pubblicazione della recensione');
    } finally {
      setReviewLoading(false);
    }
  };

  const showPrices =
    product &&
    product.section !== 'avviso' &&
    product.section !== 'propongo' &&
    product.section !== 'dono';

  if (loading) return <LoadingContainer><LoadingBox /></LoadingContainer>;
  if (error) return <ErrorContainer><MessageBox variant="danger">{error}</MessageBox></ErrorContainer>;
  if (!product) return <ErrorContainer><MessageBox variant="danger">Prodotto non trovato</MessageBox></ErrorContainer>;

  return (
    <Container style={{ padding: '2rem 1rem' }}>
      {/* Main Product Section */}
      <ProductGrid>
        {/* Image Gallery */}
        <ImageGallery>
          <MainImage>
            <Image
              src={product.image[currentImage] || '/img-not-found.png'}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/img-not-found.png';
              }}
            />
          </MainImage>
          {product.image.length > 1 && (
            <ThumbnailGrid>
              {product.image.map((img, idx) => (
                <ThumbnailButton
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  $active={currentImage === idx}
                >
                  <Image src={img} alt="" fill style={{ objectFit: 'cover' }} />
                </ThumbnailButton>
              ))}
            </ThumbnailGrid>
          )}
        </ImageGallery>

        {/* Product Info */}
        <ProductInfo>
          <ProductTitle>{product.name}</ProductTitle>
          <Rating rating={product.rating} numReviews={product.numReviews} />

          {showPrices && (
            <PriceDisplay>
              <PriceEuro>€ {product.priceEuro.toFixed(2)}</PriceEuro>
              <PriceVAL>
                <span>☯</span> {product.priceVal}
              </PriceVAL>
            </PriceDisplay>
          )}

          <DescriptionSection>
            <DescriptionTitle>Descrizione</DescriptionTitle>
            <DescriptionText>{product.description}</DescriptionText>
          </DescriptionSection>
        </ProductInfo>

        {/* Purchase Card */}
        <div>
          <PurchaseCard>
            {/* Seller Info */}
            <SellerSection>
              <SellerLabel>Offerente</SellerLabel>
              <SellerLink href={`/seller/${product.seller._id}`}>
                {product.seller.seller?.name || 'Venditore'}
              </SellerLink>
              {product.seller.seller && (
                <Rating
                  rating={product.seller.seller.rating}
                  numReviews={product.seller.seller.numReviews}
                />
              )}
            </SellerSection>

            {/* Price */}
            {showPrices && (
              <InfoRow>
                <InfoLabel>Prezzo</InfoLabel>
                <InfoValue>
                  <PriceValue>€ {product.priceEuro.toFixed(2)}</PriceValue>
                  <PriceSecondary>☯ {product.priceVal}</PriceSecondary>
                </InfoValue>
              </InfoRow>
            )}

            {/* Availability */}
            <InfoRow>
              <InfoLabel>Disponibilità</InfoLabel>
              <AvailabilityBadge $available={product.countInStock > 0}>
                {product.countInStock > 0 ? 'Disponibile' : 'Non disponibile'}
              </AvailabilityBadge>
            </InfoRow>

            {/* Quantity & Add to Cart */}
            {product.countInStock > 0 && (
              <>
                <InfoRow>
                  <InfoLabel>Quantità</InfoLabel>
                  <Select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    style={{ width: 'auto', padding: '0.5rem 1rem' }}
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </Select>
                </InfoRow>

                <PrimaryButton onClick={addToCartHandler}>
                  Contatta Offerente
                </PrimaryButton>

                {userInfo && !userInfo.hasAd && (
                  <MessageBox variant="warning">
                    Per contattare un offerente devi prima mettere un prodotto in vetrina.{' '}
                    <TextLink href="/productlist/seller">
                      Crea l&apos;annuncio adesso
                    </TextLink>
                  </MessageBox>
                )}
              </>
            )}
          </PurchaseCard>
        </div>
      </ProductGrid>

      {/* Reviews Section */}
      <ReviewsSection>
        <SectionTitle>Recensioni</SectionTitle>

        {product.reviews?.length === 0 && (
          <MessageBox variant="info">Non ci sono ancora recensioni</MessageBox>
        )}

        <div>
          {product.reviews?.map((review) => (
            <ReviewCard key={review._id}>
              <ReviewHeader>
                <ReviewerName>{review.name}</ReviewerName>
                <ReviewDate>
                  {new Date(review.createdAt).toLocaleDateString('it-IT')}
                </ReviewDate>
              </ReviewHeader>
              <Rating rating={review.rating} />
              <ReviewComment>{review.comment}</ReviewComment>
            </ReviewCard>
          ))}

          {/* Review Form */}
          <ReviewFormCard>
            {userInfo ? (
              <form onSubmit={submitReviewHandler}>
                <FormTitle>Scrivi una recensione</FormTitle>

                <FormGroup>
                  <Label htmlFor="rating">Valutazione</Label>
                  <Select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    <option value={0}>Seleziona...</option>
                    <option value={1}>1 - Scarso</option>
                    <option value={2}>2 - Discreto</option>
                    <option value={3}>3 - Buono</option>
                    <option value={4}>4 - Molto Buono</option>
                    <option value={5}>5 - Eccellente</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="comment">Commento</Label>
                  <Textarea
                    id="comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Scrivi la tua recensione..."
                  />
                </FormGroup>

                {reviewError && <MessageBox variant="danger">{reviewError}</MessageBox>}

                <PrimaryButton
                  type="submit"
                  disabled={reviewLoading}
                  style={{ width: 'auto', padding: '0.5rem 1.5rem' }}
                >
                  {reviewLoading ? 'Pubblicazione...' : 'Pubblica Recensione'}
                </PrimaryButton>
              </form>
            ) : (
              <MessageBox variant="info">
                <TextLink href="/signin">Accedi</TextLink> per scrivere una recensione
              </MessageBox>
            )}
          </ReviewFormCard>
        </div>
      </ReviewsSection>
    </Container>
  );
}
