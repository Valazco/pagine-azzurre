'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';
import Select, { SingleValue } from 'react-select';
import { DayPicker } from 'react-day-picker';
import { format, parse, isValid } from 'date-fns';
import { it } from 'date-fns/locale';
import QRCode from 'react-qr-code';
import 'react-day-picker/style.css';
import { getUserDetails, updateUserProfile, updateNewsletter, uploadSellerLogo, getPrivateKey } from '@/lib/api/users';
import { getValazcoBalance } from '@/lib/web3/contract';
import { ConnectWallet } from '@/components/web3/ConnectWallet';
import citiesOptions, { CityOption } from '@/lib/resources/citiesOptions';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import type { User } from '@/types';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FlashHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: #003366;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  color: #003366;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input<{ $readOnly?: boolean }>`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  color: ${({ $readOnly }) => ($readOnly ? '#5A5A5A' : '#111827')};
  background-color: ${({ $readOnly }) => ($readOnly ? '#f9fafb' : 'white')};

  &:focus {
    outline: none;
    border-color: #003366;
    box-shadow: 0 0 0 2px rgba(0, 51, 102, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: #003366;
    box-shadow: 0 0 0 2px rgba(0, 51, 102, 0.1);
  }
`;

const CharCount = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  text-align: right;
  margin-top: 0.25rem;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  width: fit-content;
  margin: 0 auto;
`;

const RevealButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    background-color: #4b5563;
  }
`;

const RefererList = styled.ol`
  margin: 0.5rem 0;
  padding-left: 1.5rem;
`;

const AddButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #003366;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  margin-top: 0.5rem;

  &:hover {
    background-color: #002244;
  }
`;

const LogoPreview = styled.img`
  max-width: 115px;
  max-height: 115px;
  width: auto;
  height: auto;
  display: block;
  margin: 0.5rem 0;
`;

const SubmitButton = styled.button`
  padding: 1rem 2rem;
  background-color: #003366;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;

  &:hover {
    background-color: #002244;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const AsteriskNote = styled.div`
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #6b7280;

  .little-line {
    margin-bottom: 0.25rem;
  }
`;

const DayPickerWrapper = styled.div`
  .rdp {
    --rdp-accent-color: #003366;
  }
`;

const DateInputWrapper = styled.div`
  position: relative;
`;

const DateDisplay = styled.div`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;

  &:hover {
    border-color: #003366;
  }
`;

const DatePickerPopover = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 0.25rem;
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SwitchLabel = styled.span`
  font-size: 0.875rem;
  color: #374151;
`;

const Switch = styled.button<{ $active: boolean }>`
  position: relative;
  width: 3.5rem;
  height: 2rem;
  background-color: ${({ $active }) => ($active ? '#003366' : '#d1d5db')};
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    top: 0.25rem;
    left: ${({ $active }) => ($active ? '1.75rem' : '0.25rem')};
    width: 1.5rem;
    height: 1.5rem;
    background-color: white;
    border-radius: 50%;
    transition: left 0.2s ease;
  }

  &:hover {
    background-color: ${({ $active }) => ($active ? '#002244' : '#9ca3af')};
  }
`;

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // User details
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [account, setAccount] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [birthplace, setBirthplace] = useState('');
  const [city, setCity] = useState<CityOption>({ value: '', label: '' });
  const [cf, setCf] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [referer, setReferer] = useState<string[]>([]);
  const [newReferer, setNewReferer] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerLogo, setSellerLogo] = useState('');
  const [sellerDescription, setSellerDescription] = useState('');
  const [sellerLink, setSellerLink] = useState('');
  const [hasReferer, setHasReferer] = useState(false);
  const [partitaIva, setPartitaIva] = useState('');
  const [newsletter, setNewsletter] = useState('');
  const [newsletterUpdate, setNewsletterUpdate] = useState(false);
  const [balance, setBalance] = useState(0);
  const [passphrase, setPassphrase] = useState('');
  const [hideField, setHideField] = useState(true);
  const [loadingPassphrase, setLoadingPassphrase] = useState(false);

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Upload states
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState('');

  // Update states
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [successUpdate, setSuccessUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState('');

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated' || !session?.user) {
      router.push('/signin?redirect=profile');
      return;
    }

    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const userData = await getUserDetails(session.user.id);
        setUser(userData);

        // Set form values
        setName(userData.name || '');
        setSurname(userData.surname || '');
        setAccount(userData.account || '');
        setUsername(userData.username || '');
        setGender(userData.gender || '');
        setBirthday(userData.birthday || '');
        setBirthplace(userData.birthplace || '');
        setCf(userData.cf || '');
        setZipCode(userData.zipCode?.toString() || '');
        setCity({ value: userData.city || '', label: userData.city || '' });
        setPhone(userData.phone || '');
        setEmail(userData.email || '');
        setReferer(userData.referer || []);
        setNewsletter(userData.newsletter || '');

        if (userData.partitaIva && !userData.partitaIva.match(/GMT/)) {
          setPartitaIva(userData.partitaIva);
        }

        if (userData.seller) {
          setSellerName(userData.seller.name || '');
          setSellerLogo(userData.seller.logo || '');
          setSellerDescription(userData.seller.description || '');
          setSellerLink(userData.seller.link || '');
        }

        // Parse birthday for date picker
        if (userData.birthday) {
          const parsed = parse(userData.birthday, 'dd/MM/yyyy', new Date());
          if (isValid(parsed)) {
            setSelectedDate(parsed);
          }
        }

        // Get Valazco balance separately (non-blocking)
        if (userData.account) {
          getValazcoBalance(userData.account)
            .then((bal) => setBalance(bal))
            .catch(() => setBalance(0));
        }

      } catch (err) {
        setError('Errore nel caricamento del profilo');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
    window.scrollTo(0, 0);
  }, [session, status, router]);

  const handleCityChange = (selectedOption: SingleValue<CityOption>) => {
    if (selectedOption) {
      setCity({ value: selectedOption.value, label: selectedOption.value });
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setBirthday(format(date, 'dd/MM/yyyy'));
      setShowDatePicker(false);
    }
  };

  const uploadFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingUpload(true);
    setErrorUpload('');

    try {
      const url = await uploadSellerLogo(file);
      setSellerLogo(url);
    } catch (err) {
      setErrorUpload('Errore nel caricamento del logo');
      console.error(err);
    } finally {
      setLoadingUpload(false);
    }
  };

  const addETS = (e: React.MouseEvent) => {
    e.preventDefault();
    if (newReferer && referer.length < 5) {
      setReferer([...referer, newReferer]);
      setNewReferer('');
    }
  };

  const handleRevealPassphrase = async () => {
    if (passphrase) {
      setHideField(false);
      return;
    }

    setLoadingPassphrase(true);
    try {
      const { accountKey } = await getPrivateKey();
      setPassphrase(accountKey);
      setHideField(false);
    } catch (err) {
      console.error('Error fetching private key:', err);
      alert('Errore nel recupero della chiave privata');
    } finally {
      setLoadingPassphrase(false);
    }
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setErrorUpdate('');
    setSuccessUpdate(false);

    if (password && password !== confirmPassword) {
      alert('Password e Conferma password non corrispondono');
      return;
    }

    try {
      setLoadingUpdate(true);

      await updateUserProfile({
        _id: user?._id,
        name,
        surname,
        username,
        gender: gender as 'M' | 'F' | undefined,
        birthday,
        birthplace,
        cf,
        email,
        phone,
        referer,
        city: city.value,
        zipCode: zipCode ? parseInt(zipCode) : undefined,
        ...(password && { password }),
        ...(user?.isSeller && {
          seller: {
            name: sellerName,
            logo: sellerLogo,
            description: sellerDescription,
            link: sellerLink,
            rating: user.seller?.rating || 0,
            numReviews: user.seller?.numReviews || 0,
          },
        }),
        partitaIva,
      } as Partial<User>);

      if (newsletterUpdate) {
        const result = await updateNewsletter(username, email);
        setNewsletter(result.subscribed ? 'Verified' : 'Not Verified');
        setNewsletterUpdate(false);
      }

      setSuccessUpdate(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorUpdate('Errore nell\'aggiornamento del profilo');
      console.error(err);
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (status === 'loading') return <LoadingBox />;
  if (!session?.user) return null;

  return (
    <FormContainer>
      <Form onSubmit={submitHandler}>
        <FlashHeader>
          <PageTitle>Profilo dell'utente</PageTitle>
          {user && !user.verify?.verified && (
            <MessageBox variant="warning">
              L'account deve essere ancora verificato:<br/>
              1) Esci dalle pagineazzure.net<br/>
              2) Controlla la tua mail<br/>
              3) Conferma cliccando il link di verifica
            </MessageBox>
          )}
        </FlashHeader>

        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            {loadingUpdate && <LoadingBox />}
            {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
            {successUpdate && <MessageBox variant="success">Profilo aggiornato con successo</MessageBox>}

            <FormGroup>
              <Label>Username *</Label>
              <Input
                type="text"
                value={username}
                readOnly
                $readOnly
                placeholder="Aggiungere Username"
              />
            </FormGroup>

            {user && user.verify?.verified && (
              <>
                {/* Valazco Section */}
                <FormGroup>
                  <Label>Valazco account</Label>
                  <Input
                    type="text"
                    value={account}
                    readOnly
                    $readOnly
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Saldo</Label>
                  <Input
                    type="text"
                    value={`☯ ${balance}`}
                    readOnly
                    $readOnly
                  />
                </FormGroup>

                {user?.account && (
                  <QRCodeContainer>
                    <QRCode value={user.account} level="H" size={128} />
                  </QRCodeContainer>
                )}

                <SectionTitle>Integration with Metamask:</SectionTitle>
                <FormGroup>
                  <Label>Connetti Wallet</Label>
                  <ConnectWallet />
                </FormGroup>

                <FormGroup>
                  <Label>Secret (Private Key)</Label>
                  {hideField ? (
                    <RevealButton type="button" onClick={handleRevealPassphrase} disabled={loadingPassphrase}>
                      {loadingPassphrase ? 'Caricamento...' : 'Reveal'}
                    </RevealButton>
                  ) : (
                    <Input
                      type="text"
                      value={passphrase}
                      readOnly
                      $readOnly
                    />
                  )}
                </FormGroup>

                {/* Dati anagrafici */}
                <SectionTitle>Dati anagrafici:</SectionTitle>

                <FormGroup>
                  <Label>Nome *</Label>
                  <Input
                    type="text"
                    placeholder="Aggiungere nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Cognome *</Label>
                  <Input
                    type="text"
                    placeholder="Aggiungere cognome"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Data di Nascita *</Label>
                  <DateInputWrapper>
                    <DateDisplay onClick={() => setShowDatePicker(!showDatePicker)}>
                      {birthday || format(new Date(), 'dd/MM/yyyy')}
                    </DateDisplay>
                    {showDatePicker && (
                      <DatePickerPopover>
                        <DayPickerWrapper>
                          <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            locale={it}
                            captionLayout="dropdown"
                            fromYear={1920}
                            toYear={new Date().getFullYear()}
                          />
                        </DayPickerWrapper>
                      </DatePickerPopover>
                    )}
                  </DateInputWrapper>
                </FormGroup>

                <FormGroup>
                  <Label>Genere *</Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="gender"
                        value="M"
                        checked={gender === 'M'}
                        onChange={(e) => setGender(e.target.value)}
                      />
                      M
                    </RadioLabel>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="gender"
                        value="F"
                        checked={gender === 'F'}
                        onChange={(e) => setGender(e.target.value)}
                      />
                      F
                    </RadioLabel>
                  </RadioGroup>
                </FormGroup>

                <FormGroup>
                  <Label>Comune di Nascita *</Label>
                  <Input
                    type="text"
                    placeholder="Aggiungere comune di nascita"
                    value={birthplace}
                    onChange={(e) => setBirthplace(e.target.value.toUpperCase())}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Codice Fiscale *</Label>
                  <Input
                    type="text"
                    maxLength={16}
                    placeholder="Inserisci il Codice Fiscale"
                    value={cf.length > 16 ? '' : cf}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= 16) {
                        setCf(val.toUpperCase());
                      }
                    }}
                  />
                </FormGroup>

                {/* Dettagli contatto */}
                <SectionTitle>Dettagli contatto:</SectionTitle>

                <FormGroup>
                  <Label>Email **</Label>
                  <Input
                    type="email"
                    value={email}
                    readOnly
                    $readOnly
                    placeholder="Aggiungere email"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Provincia *</Label>
                  <Select
                    value={city.value ? { value: city.value, label: city.label } : null}
                    options={citiesOptions}
                    placeholder="Aggiungere provincia di domicilio"
                    onChange={handleCityChange}
                    getOptionValue={(option) => option.value}
                    getOptionLabel={(option) => option.value}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>CAP</Label>
                  <Input
                    type="number"
                    placeholder="Aggiungere CAP"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Telefono</Label>
                  <Input
                    type="tel"
                    placeholder="Aggiungere telefono"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </FormGroup>

                {/* Referer Section */}
                <FormGroup>
                  {referer.length === 0 ? (
                    <div>
                      <Label>Partecipi a gruppi, movimenti, comitati o associazioni no profit?</Label>
                      <RadioGroup>
                        <RadioLabel>
                          <input
                            type="radio"
                            name="isReferer"
                            onClick={() => setHasReferer(true)}
                          />
                          Si
                        </RadioLabel>
                        <RadioLabel>
                          <input
                            type="radio"
                            name="isReferer"
                            defaultChecked
                            onClick={() => setHasReferer(false)}
                          />
                          No
                        </RadioLabel>
                      </RadioGroup>
                    </div>
                  ) : null}

                  {(hasReferer || referer.length > 0) && (
                    <div>
                      <Label>Gruppi, movimenti, comitati o associazioni no profit</Label>
                      <Input
                        type="text"
                        placeholder="Aggiungi al massimo cinque associazioni"
                        value={newReferer}
                        onChange={(e) => setNewReferer(e.target.value.toUpperCase())}
                      />

                      {referer.length > 0 && (
                        <RefererList>
                          {referer.slice(0, 5).map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </RefererList>
                      )}

                      {newReferer.length > 0 && referer.length < 5 && (
                        <AddButton onClick={addETS}>aggiungi</AddButton>
                      )}
                    </div>
                  )}
                </FormGroup>

                {/* Newsletter Section */}
                <SectionTitle>Iscrizione Newsletter:</SectionTitle>
                <FormGroup>
                  <SwitchContainer>
                    <SwitchLabel>
                      {newsletter === 'Verified' ? 'Iscritto' : 'Non iscritto'}
                    </SwitchLabel>
                    <Switch
                      type="button"
                      $active={newsletter === 'Verified'}
                      onClick={() => {
                        setNewsletter(newsletter === 'Verified' ? 'Not Verified' : 'Verified');
                        setNewsletterUpdate(true);
                      }}
                      aria-label="Toggle newsletter subscription"
                    />
                  </SwitchContainer>
                </FormGroup>

                {/* Seller Section */}
                {user?.isSeller && (
                  <>
                    <SectionTitle>Dati Offerente:</SectionTitle>

                    <FormGroup>
                      <Label>Logo:</Label>
                      {loadingUpload && <LoadingBox />}
                      {errorUpload && <MessageBox variant="danger">{errorUpload}</MessageBox>}
                      {sellerLogo && (
                        <LogoPreview src={sellerLogo} alt={`${name} logo`} />
                      )}
                      <input
                        type="file"
                        accept="image/jpeg"
                        onChange={uploadFileHandler}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Pagina Web</Label>
                      <Input
                        type="url"
                        placeholder="Link della tua pagina web"
                        value={sellerLink}
                        onChange={(e) => setSellerLink(e.target.value)}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Partita IVA</Label>
                      <Input
                        type="text"
                        placeholder="Partita IVA"
                        value={partitaIva}
                        onChange={(e) => setPartitaIva(e.target.value)}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Descrizione Offerente</Label>
                      <TextArea
                        placeholder="Descrizione dell'offerente"
                        maxLength={1500}
                        value={sellerDescription}
                        onChange={(e) => setSellerDescription(e.target.value)}
                      />
                      <CharCount>{sellerDescription.length}/1500 caratteri</CharCount>
                    </FormGroup>
                  </>
                )}

                {/* Password Section */}
                <SectionTitle>Cambio Password:</SectionTitle>

                <FormGroup>
                  <Label>Cambiare Password</Label>
                  <Input
                    type="password"
                    placeholder="Digita nuova password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Conferma Password</Label>
                  <Input
                    type="password"
                    placeholder="Inserire conferma di password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </FormGroup>

                <AsteriskNote>
                  <div className="little-line">(**) Campo non modificabile</div>
                  <div className="little-sisterline">(*) Campi obbligatori per offrire beni o servizi su le pagine azzurre</div>
                </AsteriskNote>

                <SubmitButton type="submit" disabled={loadingUpdate}>
                  {loadingUpdate ? 'Aggiornamento...' : 'Aggiorna Profilo'}
                </SubmitButton>
              </>
            )}
          </>
        )}
      </Form>
    </FormContainer>
  );
}
