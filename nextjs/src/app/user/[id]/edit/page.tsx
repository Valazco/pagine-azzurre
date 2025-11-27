'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';
import { useUserStore } from '@/lib/store/user';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import type { User } from '@/types';

export default function UserEditPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { userInfo } = useUserStore();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userInfo?.isAdmin) {
      router.push('/signin');
      return;
    }
    fetchUser();
  }, [userId, userInfo, router]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get<User>(`/users/${userId}`);
      setUsername(data.username);
      setEmail(data.email);
      setIsAdmin(data.isAdmin);
      setIsSeller(data.isSeller);
    } catch {
      setError('Errore nel caricamento dell\'utente');
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      setError('');
      await apiClient.put(`/users/${userId}`, {
        username,
        email,
        isAdmin,
        isSeller,
      });
      setSuccess(true);
      setTimeout(() => router.push('/userlist'), 1500);
    } catch {
      setError('Errore nell\'aggiornamento dell\'utente');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <LoadingBox />;
  if (!userInfo) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Modifica Utente</h1>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        {success && <MessageBox variant="success">Utente aggiornato!</MessageBox>}

        <form onSubmit={submitHandler} className="space-y-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Amministratore</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isSeller}
                onChange={(e) => setIsSeller(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Venditore</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={updateLoading}
              className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {updateLoading ? 'Salvataggio...' : 'Salva Modifiche'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/userlist')}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
