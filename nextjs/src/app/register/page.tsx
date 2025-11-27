'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@/lib/store/user';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasReferer, setHasReferer] = useState(false);
  const [referer, setReferer] = useState<string[]>([]);
  const [newReferer, setNewReferer] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const [validationError, setValidationError] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/verification';

  const { userInfo, loading, error, register, clearError } = useUserStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (userInfo) {
      router.push(redirect);
    }
  }, [userInfo, redirect, router]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const addReferer = (e: React.MouseEvent) => {
    e.preventDefault();
    if (newReferer && referer.length < 3) {
      setReferer([...referer, newReferer]);
      setNewReferer('');
    }
  };

  const removeReferer = (index: number) => {
    setReferer(referer.filter((_, i) => i !== index));
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (email !== confirmEmail) {
      setValidationError('Le email non coincidono');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Le password non coincidono');
      return;
    }

    if (password.length < 6) {
      setValidationError('La password deve avere almeno 6 caratteri');
      return;
    }

    try {
      await register({
        username,
        email,
        password,
        phone: username,
        cf: email.split('').map(c => c.charCodeAt(0)).join(''),
        sellername: username,
        referer,
        newsletter,
      });
    } catch {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <form
          onSubmit={submitHandler}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Crea il tuo Account</h1>
            <p className="mt-2 text-gray-600">
              Unisciti alla comunità di Pagine Azzurre
            </p>
          </div>

          {loading && <LoadingBox />}
          {(error || validationError) && (
            <MessageBox variant="danger">{validationError || error}</MessageBox>
          )}

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <input
                type="text"
                id="username"
                placeholder="Inserisci il tuo username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Indirizzo Email *
              </label>
              <input
                type="email"
                id="email"
                placeholder="Inserisci la tua email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Confirm Email */}
            <div>
              <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Conferma Email *
              </label>
              <input
                type="email"
                id="confirmEmail"
                placeholder="Conferma la tua email"
                required
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                id="password"
                placeholder="Inserisci la password (min. 6 caratteri)"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Conferma Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Conferma la password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Referer Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Partecipi a gruppi, movimenti, comitati o associazioni no profit?
              </p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="referer"
                    checked={hasReferer}
                    onChange={() => setHasReferer(true)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Sì</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="referer"
                    checked={!hasReferer}
                    onChange={() => setHasReferer(false)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>
              </div>

              {hasReferer && (
                <div className="mt-4 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nome dell'ente"
                      value={newReferer}
                      onChange={(e) => setNewReferer(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {newReferer && referer.length < 3 && (
                      <button
                        type="button"
                        onClick={addReferer}
                        className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        Aggiungi
                      </button>
                    )}
                  </div>
                  {referer.length > 0 && (
                    <ul className="space-y-2">
                      {referer.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => removeReferer(idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Rimuovi
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Newsletter Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Vuoi iscriverti alla nostra newsletter?
              </p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="newsletter"
                    checked={newsletter}
                    onChange={() => setNewsletter(true)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Sì</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="newsletter"
                    checked={!newsletter}
                    onChange={() => setNewsletter(false)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>

          <MessageBox variant="info">
            Nello spirito di scambio in solidarietà di beni, per vantaggi comuni;
            sei invitato a creare un annuncio. Una proposta o una richiesta,
            per scambiare prodotti, servizi e conoscenze.
          </MessageBox>

          <p className="text-xs text-gray-500">(*) Campi obbligatori</p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Registrazione in corso...' : 'Registrati'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Hai già un account?{' '}
            <Link
              href={`/signin?redirect=${redirect}`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Accedi
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
