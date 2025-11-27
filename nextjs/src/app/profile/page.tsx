'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/user';
import { updateUserProfile } from '@/lib/api/users';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';

export default function ProfilePage() {
  const router = useRouter();
  const { userInfo } = useUserStore();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo) {
      router.push('/signin?redirect=profile');
      return;
    }
    setUsername(userInfo.username || '');
    setEmail(userInfo.email || '');
  }, [userInfo, router]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password && password !== confirmPassword) {
      setError('Le password non coincidono');
      return;
    }

    try {
      setLoading(true);
      await updateUserProfile({
        username,
        email,
        ...(password && { password }),
      });
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch {
      setError('Errore nell\'aggiornamento del profilo');
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Il Mio Profilo</h1>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        {loading && <LoadingBox />}
        {success && <MessageBox variant="success">Profilo aggiornato con successo!</MessageBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}

        <form onSubmit={submitHandler} className="space-y-6 mt-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cambia Password</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Nuova Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Lascia vuoto per non modificare"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Conferma Nuova Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Conferma la nuova password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Aggiornamento...' : 'Aggiorna Profilo'}
          </button>
        </form>

        {/* Account Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Info Account</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Stato:</span>
              <span className={`ml-2 ${userInfo.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                {userInfo.verified ? 'Verificato' : 'Non verificato'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Tipo:</span>
              <span className="ml-2">
                {userInfo.isAdmin ? 'Admin' : userInfo.isSeller ? 'Venditore' : 'Utente'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
