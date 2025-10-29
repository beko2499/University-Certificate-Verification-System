import React, { useState } from 'react';
import type { Page } from '../types';
import { ShieldCheckIcon } from './Icons';

interface AdminLoginPageProps {
  onLogin: (username: string) => void;
  t: (key: string) => string;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin, t }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call. Here we use hardcoded credentials.
    if (username === 'admin' && password === 'password') {
      setError('');
      onLogin(username);
    } else {
      setError(t('invalidCredentialsError'));
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 bg-gray-200">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <ShieldCheckIcon className="w-16 h-16 mx-auto text-sky-600" />
            <h2 className="text-2xl font-bold text-gray-800 mt-4">{t('adminLoginTitle')}</h2>
            <p className="text-gray-500">{t('adminLoginSubtitle')}</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                {t('usernameLabel')}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder={t('usernamePlaceholder')}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                {t('passwordLabel')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder={t('passwordPlaceholder')}
              />
            </div>
            {error && <p className="text-red-500 text-xs italic text-center">{error}</p>}
            <div className="flex items-center justify-center mt-6">
              <button
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                type="submit"
              >
                {t('signInButton')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;