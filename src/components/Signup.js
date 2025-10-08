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
    const isPasswordValid = true //password.length >= 8;
    const isFormValid = username.length > 0 && isPasswordValid;

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
        <div className="flex items-center justify-center p-3 relative z-10">
            <section id="signup" className="max-w-md w-full bg-blue-100" style={{ borderRadius: '0.3125rem', padding: '1.5rem' }}>
                <div className="text-center mb-6">
                    <h3 className="text-blue-800 text-lg font-bold mb-1">Join the Fun</h3>
                    <p className="text-blue-800 text-sm">Create your account and start gaming</p>
                </div>
                
                {/* Consolidated form (previously UserForm component) */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="signup-username" className="block text-blue-800 font-medium mb-2">Username</label>
                        <input
                            id="signup-username"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value) }}
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="signup-password" className="block text-blue-800 font-medium mb-2">Password</label>
                        <input
                            type="password"
                            id="signup-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                                !isPasswordValid ? 'border-red-300 focus:ring-red-500' : 'border-blue-300 focus:ring-blue-800'
                            }`}
                        />
                        {!isPasswordValid && (
                            <p className="text-red-600 text-xs mt-1">Password must be at least 8 characters long</p>
                        )}
                        {password.length === 0 && (
                            <p className="text-blue-800 text-xs mt-1">Minimum 8 characters required</p>
                        )}
                    </div>
                    
                    {errorMessage && (
                        <div className="text-red-700 text-sm bg-red-100 border border-red-400 rounded-lg p-3">
                            {errorMessage}
                        </div>
                    )}
                    
                    <button
                        onClick={submitForm}
                        disabled={!isFormValid || isSubmitting}
                        className={`w-full py-2 px-4 rounded-lg font-bold mt-4 transition-colors duration-200 ${
                            isFormValid && !isSubmitting
                                ? 'bg-blue-800 text-white hover:bg-blue-900'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                </div>
                
                <div className="text-center pt-3 border-t border-blue-200 mt-4">
                    <p className="text-sm text-blue-800">
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-800 font-medium hover:underline transition-all duration-300">
                            Sign In
                        </a>
                    </p>
                </div>
            </section>
        </div>
    );
}

export default Signup;
