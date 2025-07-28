import { useData } from '../utils/DataContext';
import { useNavigate } from 'react-router-dom';
import UserForm from './UserForm';

function Signup() {
    
    const { signUpWithEmail } = useData();
    const navigate = useNavigate();

    const submitForm = (email, password, username, character, color)=>{
        signUpWithEmail(email, password, username, character, color, ()=>navigate('/') );
    }
    
    return (
        <section id="signup" className="max-w-md mx-2 mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h3>
            
            <UserForm 
                submitForm={submitForm}
            />
            
            <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                        Sign In
                    </a>
                </p>
            </div>
        </section>
    );
}

export default Signup;
