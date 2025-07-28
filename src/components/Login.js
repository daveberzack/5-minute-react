import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../utils/DataContext';

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { signInWithEmail, userData } = useData();
    const navigate = useNavigate();

    const signIn = () => {
        signInWithEmail(email, password, ()=>navigate("/"));
    }

    return (
        <section id="login" className="max-w-md mx-2 mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h3>
            
            <div className="space-y-4">
                <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e)=>{ setEmail(e.target.value) }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>
                
                <button
                    onClick={signIn}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-[#282850] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                >
                    Sign In
                </button>
                
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </div>
                
            </div>
        </section>
    );
}

export default Login;