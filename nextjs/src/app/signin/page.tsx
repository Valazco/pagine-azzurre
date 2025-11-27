'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@/lib/store/user';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';

export default function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { userInfo, loading, error, signin, clearError } = useUserStore();

  useEffect(() => {
    if (userInfo) {
      router.push(redirect);
    }
  }, [userInfo, redirect, router]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signin(email, password);
    } catch {
      // Error is handled by the store
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
            <h1 className="text-3xl font-bold text-gray-900">Accedi</h1>
            <p className="mt-2 text-gray-600">
              Benvenuto su Pagine Azzurre
            </p>
          </div>

          {loading && <LoadingBox />}
          {error && <MessageBox variant="danger">{error}</MessageBox>}

          <div className="space-y-4">
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

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Inserisci la tua password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>

          <div className="text-center space-y-3 text-sm">
            <p className="text-gray-600">
              Nuovo utente?{' '}
              <Link
                href={`/register?redirect=${redirect}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Registrati
              </Link>
            </p>
            <p className="text-gray-600">
              Hai dimenticato la password?{' '}
              <Link
                href="/password-recovery"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Recupera password
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
