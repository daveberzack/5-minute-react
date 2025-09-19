import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserForm from './UserForm';

function Signup() {
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const submitForm = async (email, password, username, character, color) => {
        try {
            await register(email, password, username, character, color);
            navigate('/');
        } catch (error) {
            console.error('Signup failed:', error);
        }
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center p-3 relative z-10">
            <section id="signup" className="glass-card max-w-md w-full p-4 sm:p-6 shadow-xl">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M15 12C17.21 12 19 10.21 19 8S17.21 4 15 4 11 5.79 11 8 12.79 12 15 12M6 10V7H4V10H1V12H4V15H6V12H9V10H6M15 14C12.33 14 7 15.34 7 18V20H23V18C23 15.34 17.67 14 15 14Z"/>
                        </svg>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gradient mb-1">Join the Fun</h3>
                    <p className="text-gray-600 text-sm">Create your account and start gaming</p>
                </div>
                
                <UserForm
                    submitForm={submitForm}
                />
                
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
