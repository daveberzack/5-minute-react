import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    
    // Form state 
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form validation 
    const isPasswordValid = password.length >= 8 || password.length === 0;
    const isFormValid = username.length > 0 && password.length >= 8;

    const submitForm = async () => {
        if (password.length < 8) {
            return; // Let the visual feedback handle this
        }
        
        setIsSubmitting(true);
        try {
            setErrorMessage(''); // Clear any previous errors
            await register(username, password);
            navigate('/');
        } catch (error) {
            console.error('Signup failed:', error);
            
            // Handle different types of errors
            if (error.message && error.message.includes('400')) {
                // Try to extract validation errors from the response
                if (error.details) {
                    const errorDetails = error.details;
                    if (errorDetails.password) {
                        setErrorMessage(errorDetails.password[0]);
                    } else if (errorDetails.username) {
                        setErrorMessage(errorDetails.username[0]);
                    } else {
                        setErrorMessage('Registration failed. Please check your information.');
                    }
                } else {
                    setErrorMessage('Registration failed. Please ensure your password is at least 8 characters long.');
                }
            } else {
                setErrorMessage('Registration failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center p-3 relative z-10">
            <section id="signup" className="glass-card max-w-md w-full p-4 sm:p-6 shadow-xl">
                <div className="text-center mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gradient mb-1">Join the Fun</h3>
                    <p className="text-gray-600 text-sm">Create your account and start gaming</p>
                </div>
                
                {/* Consolidated form (previously UserForm component) */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="signup-username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            id="signup-username"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value) }}
                            className="form-input w-full px-3 py-2.5 text-sm rounded-lg shadow-sm focus:outline-none transition-all duration-300"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="signup-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            className={`form-input w-full px-3 py-2.5 text-sm rounded-lg shadow-sm focus:outline-none transition-all duration-300 ${
                                !isPasswordValid ? 'border-red-300 focus:border-red-500' : ''
                            }`}
                        />
                        {!isPasswordValid && (
                            <p className="text-red-600 text-xs mt-1">Password must be at least 8 characters long</p>
                        )}
                        {password.length === 0 && (
                            <p className="text-gray-500 text-xs mt-1">Minimum 8 characters required</p>
                        )}
                    </div>
                    
                    {errorMessage && (
                        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                            {errorMessage}
                        </div>
                    )}
                    
                    <button
                        onClick={submitForm}
                        disabled={!isFormValid || isSubmitting}
                        className={`w-full py-2.5 px-4 text-sm rounded-lg font-medium shadow-md mt-4 transition-all duration-300 ${
                            isFormValid && !isSubmitting
                                ? 'btn-gradient hover:scale-105'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                </div>
                
                <div className="text-center pt-3 border-t border-gray-200 mt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="text-gradient font-medium hover:underline transition-all duration-300">
                            Sign In
                        </a>
                    </p>
                </div>
            </section>
        </div>
    );
}

export default Signup;
