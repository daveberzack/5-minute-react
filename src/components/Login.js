import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const signIn = async () => {
        try {
            setError("");
            await login(username, password);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-3 relative z-10">
            <section id="login" className="glass-card max-w-md w-full p-4 sm:p-6 shadow-xl">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H19V9Z"/>
                        </svg>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gradient mb-1">Welcome Back</h3>
                    <p className="text-gray-600 text-sm">Sign in to track your game scores</p>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="login-username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            id="login-username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e)=>{ setUsername(e.target.value) }}
                            className="form-input w-full px-3 py-2.5 text-sm rounded-lg shadow-sm focus:outline-none transition-all duration-300"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="login-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e)=>{ setPassword(e.target.value) }}
                            className="form-input w-full px-3 py-2.5 text-sm rounded-lg shadow-sm focus:outline-none transition-all duration-300"
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
                        className="btn-gradient w-full py-2.5 px-4 text-sm rounded-lg font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <div className="loading-spinner w-4 h-4 mr-2"></div>
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                    
                    <div className="text-center pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-gradient font-medium hover:underline transition-all duration-300">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Login;