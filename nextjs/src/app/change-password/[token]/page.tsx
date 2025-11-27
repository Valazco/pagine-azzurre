'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { changePassword } from '@/lib/api/users';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Le password non coincidono');
      return;
    }

    if (newPassword.length < 6) {
      setError('La password deve avere almeno 6 caratteri');
      return;
    }

    setLoading(true);

    try {
      await changePassword(token, newPassword);
      router.push('/signin');
    } catch {
      setError('Errore durante il cambio password. Il link potrebbe essere scaduto.');
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
            <h1 className="text-3xl font-bold text-gray-900">Ripristina Password</h1>
            <p className="mt-2 text-gray-600">
              Inserisci la tua nuova password
            </p>
          </div>

          {loading && <LoadingBox />}
          {error && <MessageBox variant="danger">{error}</MessageBox>}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nuova Password
              </label>
              <input
                type="password"
                id="newPassword"
                placeholder="Inserisci la nuova password (min. 6 caratteri)"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Conferma Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Conferma la nuova password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Salvataggio...' : 'Salva Nuova Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
