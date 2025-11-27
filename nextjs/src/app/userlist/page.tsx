'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api/client';
import { useUserStore } from '@/lib/store/user';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import type { User } from '@/types';

export default function UserListPage() {
  const router = useRouter();
  const { userInfo } = useUserStore();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo?.isAdmin) {
      router.push('/signin');
      return;
    }
    fetchUsers();
  }, [userInfo, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/users');
      setUsers(data);
    } catch {
      setError('Errore nel caricamento degli utenti');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo utente?')) return;
    try {
      await apiClient.delete(`/users/${id}`);
      fetchUsers();
    } catch {
      alert('Errore nell\'eliminazione dell\'utente');
    }
  };

  if (!userInfo) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestione Utenti</h1>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Username</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Admin</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Seller</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {user._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.isAdmin ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.isAdmin ? 'Sì' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.isSeller ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.isSeller ? 'Sì' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/user/${user._id}/edit`}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                        >
                          Modifica
                        </Link>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                        >
                          Elimina
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
