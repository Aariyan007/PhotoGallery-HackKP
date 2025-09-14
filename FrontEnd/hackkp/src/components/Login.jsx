import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLoginSubmit = async () => {
    setErrors({});
    const newErrors = {};

    if (!loginData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful login
      const userData = {
        name: loginData.email.split('@')[0],
        email: loginData.email
      };
      
      onLogin(userData);
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLoginSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-400 mt-2">Sign in to access your photo gallery</p>
        </div>

        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <div className="relative group">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`w-full pl-10 pr-4 py-3 bg-gray-900/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-gray-400 transition-all duration-300 ${
                  errors.email ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-2">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative group">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={loginData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`w-full pl-10 pr-12 py-3 bg-gray-900/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-gray-400 transition-all duration-300 ${
                  errors.password ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-2">{errors.password}</p>
            )}
          </div>

          <div className="text-right">
            <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
              Forgot Password?
            </button>
          </div>

          {errors.submit && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {errors.submit}
            </p>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={handleLoginSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-violet-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group hover:scale-105 active:scale-95"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button onClick={() => navigate('/register')} className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;