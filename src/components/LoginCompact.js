import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginCompact() {
  const [email, setEmail] = useState("d1@example.com");
  const [password, setPassword] = useState("Pass1234");
  const [error, setError] = useState("");

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const signIn = async () => {
    try {
      setError("");
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-blue-100" style={{ borderRadius: '0.3125rem', padding: '1.5rem' }}>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H19V9Z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-800 mb-1">Welcome Back</h3>
            <p className="text-blue-600 text-sm">Sign in to track your game scores</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-blue-700 mb-1">Email Address</label>
              <input
                id="login-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-blue-700 mb-1">Password</label>
              <input
                type="password"
                id="login-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            
            <button
              onClick={signIn}
              disabled={isLoading}
              className="w-full bg-blue-800 text-white py-2.5 px-4 text-sm rounded-lg font-medium hover:bg-blue-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginCompact;