'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { requestPasswordRecovery } from '@/lib/api/users';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';

export default function PasswordRecoveryPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await requestPasswordRecovery(email);
      setSuccess(true);
    } catch {
      setError("L'email non risulta registrata. Vuoi registrarti adesso?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <form
          onSubmit={submitHandler}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Recupero Password</h1>
            <p className="mt-2 text-gray-600">
              Inserisci la tua email per ricevere le istruzioni
            </p>
          </div>

          {loading && <LoadingBox />}

          {success && (
            <MessageBox variant="success">
              Controlla la tua email per confermare il ripristino della password
            </MessageBox>
          )}

          {error && (
            <div>
              <MessageBox variant="danger">{error}</MessageBox>
              <div className="mt-4 text-center">
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Registrati ora
                </Link>
              </div>
            </div>
          )}

          {!success && (
            <>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Indirizzo Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Inserisci la tua email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Invio in corso...' : 'Recupera Password'}
              </button>
            </>
          )}

          <div className="text-center text-sm text-gray-600">
            <Link
              href="/signin"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Torna al login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
