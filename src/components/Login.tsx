'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Email/username dan password harus diisi');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Demo credentials - dalam production harus validasi dengan backend
      if (username === 'admin' && password === 'admin123') {
        toast.success('Login berhasil! Selamat datang ' + username);
        login({ username, password, rememberMe: true });
        router.replace('/dashboard');
        setIsLoading(false);
      } else if (username === 'user' && password === 'user123') {
        toast.success('Login berhasil! Selamat datang ' + username);
        login({ username, password, rememberMe: true });
        router.replace('/dashboard');
        setIsLoading(false);
      } else {
        toast.error('Email/username atau password salah');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 items-center justify-center p-12 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          {/* Top gradient circles */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl"></div>
          <div className="absolute top-32 right-32 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl"></div>
          
          {/* Bottom shapes */}
          <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-blue-600/30 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-white max-w-lg">
          <h1 className="text-5xl font-bold mb-2 leading-tight">
            One Integrated<br />
            Logistic System
          </h1>
          <h2 className="text-6xl font-bold mb-12">OILS</h2>
          
          {/* Illustration Card */}
          <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
            {/* Browser-like header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
            </div>
            
            {/* Content area with cards illustration */}
            <div className="space-y-4">
              {/* Top row - Credit card like elements */}
              <div className="flex gap-3">
                <div className="flex-1 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 shadow-lg transform -rotate-6 h-32">
                  <div className="space-y-2">
                    <div className="w-8 h-6 bg-yellow-400 rounded"></div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom card - Patra card */}
              <div className="relative">
                <div className="bg-white rounded-xl p-3 shadow-xl transform rotate-3 inline-flex items-center gap-2">
                  <div className="bg-blue-600 text-white px-3 py-1.5 rounded font-bold text-sm">
                    PERTAMINA
                  </div>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* USB/Key illustration */}
            <div className="absolute bottom-6 right-6">
              <div className="w-12 h-6 bg-gray-200 rounded-lg shadow-md transform rotate-12"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-white rounded-3xl shadow-2xl p-10">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-4">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mr-2">
                  <path d="M24 4L10 12L24 20L38 12L24 4Z" fill="#1E40AF"/>
                  <path d="M10 12V28L24 36L38 28V12" fill="#EF4444"/>
                  <circle cx="38" cy="12" r="6" fill="#10B981"/>
                </svg>
              </div>
              <div className="mb-2">
                <div className="text-xl font-bold text-gray-900">PERTAMINA</div>
                <div className="text-xs text-blue-600 tracking-wider">PATRA LOGISTIK</div>
              </div>
            </div>

            {/* Login Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Login</h2>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email/Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm text-gray-600 mb-2">
                  mail address or username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your email or username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm text-gray-600 mb-2">
                  password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Credentials - Optional, can be removed in production
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-900 mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-blue-700">
                <p>Admin: <code className="bg-blue-100 px-2 py-0.5 rounded">admin</code> / <code className="bg-blue-100 px-2 py-0.5 rounded">admin123</code></p>
                <p>User: <code className="bg-blue-100 px-2 py-0.5 rounded">user</code> / <code className="bg-blue-100 px-2 py-0.5 rounded">user123</code></p>
              </div>
            </div> */}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>© 2024 Pertamina Patra Logistik. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
