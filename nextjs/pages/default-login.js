// pages/default-login.js
import React, { useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import GoogleLoginButton from '../components/social_login_google';
import { authenticateUser } from '../services/authService';
import { googleAuth } from '../services/googleAuthService';
import { useAuth } from '../contexts/authContext';

export default function DefaultLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const authData = {
        username: email,
        password: password,
        grant_type: 'password',
      };
      //const response = await authenticateUser(authData);
      await login(email, password);
      router.push("/browse_spaces");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLoginSuccess = async (response) => {
    try {
      const token = response.tokenId;
      const authResponse = await googleAuth(token);
      if (authResponse) {
        // Ideally, you should set session/cookie here with received token
        router.push("/dashboard");
      }
    } catch (error) {
      console.error('Failed to login with Google:', error);
    }
  };

  const handleLoginFailure = (response) => {
    console.error('Failed to login with Google:', response);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                Sign in
              </button>
            </div>
          </form>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div>
              <GoogleLoginButton onSuccess={handleLoginSuccess} onFailure={handleLoginFailure} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

