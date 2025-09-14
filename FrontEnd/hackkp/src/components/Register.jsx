import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = ({ onRegister }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  // Validation
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 25, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 8) return { strength: 50, label: 'Fair', color: 'bg-yellow-500' };
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 100, label: 'Strong', color: 'bg-green-500' };
    return { strength: 75, label: 'Good', color: 'bg-blue-500' };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleKeyPress = (e) => e.key === 'Enter' && handleRegisterSubmit();

  const handleRegisterSubmit = async () => {
    const newErrors = {};

    if (!registerData.name.trim()) newErrors.name = 'Name is required';
    if (!registerData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(registerData.email)) newErrors.email = 'Invalid email';
    if (!registerData.password) newErrors.password = 'Password is required';
    else if (!validatePassword(registerData.password)) newErrors.password = 'Password must be at least 6 characters';
    if (!registerData.confirmPassword) newErrors.confirmPassword = 'Confirm your password';
    else if (registerData.password !== registerData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(res => setTimeout(res, 1500));

      setSuccessMessage('Registration successful! Redirecting...');
      setErrors({});

      setTimeout(() => {
        const userData = { name: registerData.name, email: registerData.email };
        onRegister(userData);
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setErrors({ submit: error.message || 'Registration failed.' });
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(registerData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Join Us Today
          </h2>
          <p className="text-gray-400 mt-2">Create your account and start your journey</p>
        </div>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={registerData.name}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your full name"
              className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your email"
              className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.email ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={registerData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Create a password"
                className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.password ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {registerData.password && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400">{passwordStrength.label}</span>
              </div>
            )}
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={registerData.confirmPassword}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Error */}
          {errors.submit && <p className="text-red-400 text-sm mt-2 text-center">{errors.submit}</p>}

          {/* Success Message */}
          {successMessage && <p className="text-green-400 text-sm mt-2 text-center">{successMessage}</p>}

          {/* Submit Button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleRegisterSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Footer */}
          <p className="text-gray-400 text-center mt-2 text-xs">
            Already have an account?{' '}
            <button onClick={() => navigate('/')} className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
