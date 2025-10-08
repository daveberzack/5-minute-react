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
        <div className="flex items-center justify-center p-3 relative z-10">
            <section id="login" className="max-w-md w-full bg-blue-100" style={{ borderRadius: '0.3125rem', padding: '1.5rem' }}>
                <div className="text-center mb-6">
                    <h3 className="text-blue-800 text-lg font-bold mb-1">Welcome Back</h3>
                    <p className="text-blue-800 text-sm">Sign in to track your game scores</p>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="login-username" className="block text-blue-800 font-medium mb-2">Username</label>
                        <input
                            id="login-username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e)=>{ setUsername(e.target.value) }}
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="login-password" className="block text-blue-800 font-medium mb-2">Password</label>
                        <input
                            type="password"
                            id="login-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e)=>{ setPassword(e.target.value) }}
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                        />
                    </div>
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}
                    
                    <button
                        onClick={signIn}
                        disabled={isLoading}
                        className="w-full bg-blue-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                    
                    <div className="text-center pt-3 border-t border-blue-200">
                        <p className="text-sm text-blue-800">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-blue-800 font-medium hover:underline transition-all duration-300">
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