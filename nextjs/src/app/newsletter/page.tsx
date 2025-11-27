'use client';

import { useState, FormEvent } from 'react';
import MessageBox from '@/components/ui/MessageBox';
import LoadingBox from '@/components/ui/LoadingBox';
import apiClient from '@/lib/api/client';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      setLoading(true);
      await apiClient.post('/users/newsletter', { email, name });
      setSuccess(true);
      setEmail('');
      setName('');
    } catch {
      setError('Errore nell\'iscrizione. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📬</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
            <p className="text-gray-600 mt-2">
              Resta aggiornato sulle novità di Pagine Azzurre
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <MessageBox variant="success">
                Grazie per l&apos;iscrizione! Controlla la tua email per confermare.
              </MessageBox>
            </div>
          ) : (
            <form onSubmit={submitHandler} className="space-y-6">
              {loading && <LoadingBox />}
              {error && <MessageBox variant="danger">{error}</MessageBox>}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Il tuo nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="La tua email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Iscrizione...' : 'Iscriviti'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
