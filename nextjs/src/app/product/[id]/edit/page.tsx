'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { getProduct, updateProduct } from '@/lib/api/products';
import { useUserStore } from '@/lib/store/user';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import {
  Container,
  PageTitle,
  CardBase,
  PrimaryButton,
  SecondaryButton,
  FormGroup,
  Label,
  Input,
  Select,
  Textarea,
  LoadingContainer
} from '@/lib/styles';

// Styled Components
const FormCard = styled(CardBase)`
  padding: 2rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
`;

const FormGrid = styled.div<{ $twoCols?: boolean }>`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  ${({ $twoCols }) =>
    $twoCols &&
    `
    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }
  `}
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  color: #2563eb;
  border-radius: 0.25rem;
`;

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { userInfo } = useUserStore();

  const [name, setName] = useState('');
  const [priceEuro, setPriceEuro] = useState(0);
  const [priceVal, setPriceVal] = useState(0);
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [section, setSection] = useState<'offro' | 'cerco' | 'propongo' | 'avviso' | 'dono'>('offro');
  const [isService, setIsService] = useState(false);

  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userInfo?.isAdmin && !userInfo?.isSeller) {
      router.push('/signin');
      return;
    }
    fetchProduct();
  }, [productId, userInfo, router]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await getProduct(productId);
      setName(product.name);
      setPriceEuro(product.priceEuro);
      setPriceVal(product.priceVal);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setSection(product.section);
      setIsService(product.isService);
    } catch {
      setError('Errore nel caricamento del prodotto');
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      setError('');
      await updateProduct(productId, {
        name,
        priceEuro,
        priceVal,
        category,
        countInStock,
        description,
        section,
        isService,
      });
      setSuccess(true);
      setTimeout(() => router.push('/productlist'), 1500);
    } catch {
      setError('Errore nell\'aggiornamento del prodotto');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <LoadingContainer><LoadingBox /></LoadingContainer>;
  if (!userInfo) return null;

  return (
    <Container style={{ maxWidth: '42rem', padding: '2rem 1rem' }}>
      <PageTitle>Modifica Prodotto</PageTitle>

      <FormCard>
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        {success && <MessageBox variant="success">Prodotto aggiornato!</MessageBox>}

        <form onSubmit={submitHandler} style={{ marginTop: '1rem' }}>
          <FormGroup>
            <Label>Nome *</Label>
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>

          <FormGrid $twoCols>
            <FormGroup>
              <Label>Prezzo Euro *</Label>
              <Input
                type="number"
                step="0.01"
                required
                value={priceEuro}
                onChange={(e) => setPriceEuro(Number(e.target.value))}
              />
            </FormGroup>
            <FormGroup>
              <Label>Prezzo VAL *</Label>
              <Input
                type="number"
                required
                value={priceVal}
                onChange={(e) => setPriceVal(Number(e.target.value))}
              />
            </FormGroup>
          </FormGrid>

          <FormGrid $twoCols>
            <FormGroup>
              <Label>Categoria *</Label>
              <Input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Quantità *</Label>
              <Input
                type="number"
                required
                value={countInStock}
                onChange={(e) => setCountInStock(Number(e.target.value))}
              />
            </FormGroup>
          </FormGrid>

          <FormGrid $twoCols>
            <FormGroup>
              <Label>Sezione</Label>
              <Select
                value={section}
                onChange={(e) => setSection(e.target.value as typeof section)}
              >
                <option value="offro">Offro</option>
                <option value="cerco">Cerco</option>
                <option value="propongo">Propongo</option>
                <option value="avviso">Avviso</option>
                <option value="dono">Dono</option>
              </Select>
            </FormGroup>
            <FormGroup style={{ display: 'flex', alignItems: 'center' }}>
              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  checked={isService}
                  onChange={(e) => setIsService(e.target.checked)}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                  È un servizio
                </span>
              </CheckboxLabel>
            </FormGroup>
          </FormGrid>

          <FormGroup>
            <Label>Descrizione *</Label>
            <Textarea
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormGroup>

          <ButtonGroup>
            <PrimaryButton
              type="submit"
              disabled={updateLoading}
              style={{ flex: 1 }}
            >
              {updateLoading ? 'Salvataggio...' : 'Salva Modifiche'}
            </PrimaryButton>
            <SecondaryButton
              type="button"
              onClick={() => router.push('/productlist')}
              style={{ padding: '0.75rem 1.5rem' }}
            >
              Annulla
            </SecondaryButton>
          </ButtonGroup>
        </form>
      </FormCard>
    </Container>
  );
}
