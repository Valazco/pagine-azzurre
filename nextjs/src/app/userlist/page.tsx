'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api/client';
import { useUserStore } from '@/lib/store/user';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import type { User } from '@/types';
import {
  Container,
  PageTitle,
  CardBase,
} from '@/lib/styles';

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
    <Container style={{ padding: '2rem 1rem' }}>
      <PageTitle>Gestione Utenti</PageTitle>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <CardBase style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>ID</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>Username</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>Email</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>Admin</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>Seller</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    style={{ borderBottom: '1px solid #f3f4f6', transition: 'background-color 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280', fontFamily: 'monospace' }}>
                      {user._id.slice(-8)}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#111827' }}>{user.username}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>{user.email}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        borderRadius: '9999px',
                        backgroundColor: user.isAdmin ? '#dcfce7' : '#f3f4f6',
                        color: user.isAdmin ? '#15803d' : '#6b7280'
                      }}>
                        {user.isAdmin ? 'Sì' : 'No'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        borderRadius: '9999px',
                        backgroundColor: user.isSeller ? '#dbeafe' : '#f3f4f6',
                        color: user.isSeller ? '#1d4ed8' : '#6b7280'
                      }}>
                        {user.isSeller ? 'Sì' : 'No'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          href={`/user/${user._id}/edit`}
                          style={{
                            padding: '0.25rem 0.75rem',
                            fontSize: '0.875rem',
                            backgroundColor: '#dbeafe',
                            color: '#2563eb',
                            borderRadius: '0.25rem',
                            textDecoration: 'none',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#bfdbfe'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                        >
                          Modifica
                        </Link>
                        <button
                          onClick={() => handleDelete(user._id)}
                          style={{
                            padding: '0.25rem 0.75rem',
                            fontSize: '0.875rem',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            borderRadius: '0.25rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
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
        </CardBase>
      )}
    </Container>
  );
}
