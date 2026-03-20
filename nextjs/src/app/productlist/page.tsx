'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { getProducts, deleteProduct, createProduct } from '@/lib/api/products';
import { useUserStore } from '@/lib/store/user';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import Pagination from '@/components/ui/Pagination';
import { Container, PageTitle, FlexBetween, PrimaryButton, LoadingContainer, ErrorContainer, EmptyContainer } from '@/lib/styles';
import type { Product } from '@/types';

// Styled Components
const TableCard = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  border: 1px solid #f3f4f6;
  overflow: hidden;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
`;

const TableHead = styled.thead`
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f9fafb;
  }
`;

const TableHeader = styled.th`
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
`;

const TableBody = styled.tbody`
  & tr {
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
      border-bottom: none;
    }
  }
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
`;

const ProductImage = styled.div`
  position: relative;
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: #f3f4f6;
`;

const ProductName = styled.div`
  font-size: 0.875rem;
  color: #111827;
  max-width: 20rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PriceCell = styled.div`
  font-size: 0.875rem;
`;

const PriceEuro = styled.span`
  color: #111827;
`;

const PriceVAL = styled.span`
  color: #2563eb;
  margin-left: 0.5rem;
`;

const CategoryText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const StockText = styled.span<{ $inStock: boolean }>`
  font-size: 0.875rem;
  color: ${({ $inStock }) => ($inStock ? '#059669' : '#dc2626')};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditButton = styled(Link)`
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  background-color: #dbeafe;
  color: #2563eb;
  border-radius: 0.25rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #bfdbfe;
  }
`;

const DeleteButton = styled.button`
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  background-color: #fee2e2;
  color: #dc2626;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #fecaca;
  }
`;

export default function ProductListPage() {
  const router = useRouter();
  const { userInfo } = useUserStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!userInfo?.isAdmin && !userInfo?.isSeller) {
      router.push('/signin');
      return;
    }
    fetchProducts();
  }, [userInfo, router, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts({ pageNumber: page });
      setProducts(data.products);
      setPages(data.pages);
    } catch {
      setError('Errore nel caricamento dei prodotti');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      setActionLoading(true);
      const product = await createProduct();
      router.push(`/product/${product._id}/edit`);
    } catch {
      alert('Errore nella creazione del prodotto');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch {
      alert('Errore nell\'eliminazione del prodotto');
    }
  };

  if (!userInfo) return null;

  return (
    <Container style={{ padding: '2rem 1rem' }}>
      <FlexBetween style={{ marginBottom: '2rem' }}>
        <PageTitle style={{ marginBottom: 0 }}>Gestione Prodotti</PageTitle>
        <PrimaryButton
          onClick={handleCreate}
          disabled={actionLoading}
          style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
        >
          {actionLoading ? 'Creazione...' : 'Nuovo Prodotto'}
        </PrimaryButton>
      </FlexBetween>

      {loading ? (
        <LoadingContainer>
          <LoadingBox />
        </LoadingContainer>
      ) : error ? (
        <ErrorContainer>
          <MessageBox variant="danger">{error}</MessageBox>
        </ErrorContainer>
      ) : products.length === 0 ? (
        <EmptyContainer>
          <MessageBox variant="info">Nessun prodotto trovato</MessageBox>
        </EmptyContainer>
      ) : (
        <>
          <TableCard>
            <TableWrapper>
              <Table>
                <TableHead>
                  <tr>
                    <TableHeader>Immagine</TableHeader>
                    <TableHeader>Nome</TableHeader>
                    <TableHeader>Prezzo</TableHeader>
                    <TableHeader>Categoria</TableHeader>
                    <TableHeader>Stock</TableHeader>
                    <TableHeader>Azioni</TableHeader>
                  </tr>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <ProductImage>
                          <Image
                            src={product.image?.[0] || '/img-not-found.png'}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </ProductImage>
                      </TableCell>
                      <TableCell>
                        <ProductName>{product.name}</ProductName>
                      </TableCell>
                      <TableCell>
                        <PriceCell>
                          <PriceEuro>€{product.priceEuro}</PriceEuro>
                          <PriceVAL>☯{product.priceVal}</PriceVAL>
                        </PriceCell>
                      </TableCell>
                      <TableCell>
                        <CategoryText>{product.category}</CategoryText>
                      </TableCell>
                      <TableCell>
                        <StockText $inStock={product.countInStock > 0}>
                          {product.countInStock}
                        </StockText>
                      </TableCell>
                      <TableCell>
                        <ActionButtons>
                          <EditButton href={`/product/${product._id}/edit`}>
                            Modifica
                          </EditButton>
                          <DeleteButton onClick={() => handleDelete(product._id)}>
                            Elimina
                          </DeleteButton>
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>
          </TableCard>

          {pages > 1 && (
            <Pagination currentPage={page} totalPages={pages} basePath="/productlist/page" />
          )}
        </>
      )}
    </Container>
  );
}
