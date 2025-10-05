import {useState} from 'react';

function UserForm({
  submitForm,
  errorMessage
}) {

    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitClicked = async ()=> {
      if (password.length < 8) {
        return; // Let the visual feedback handle this
      }
      
      setIsSubmitting(true);
      try {
        await submitForm(username, password);
      } finally {
        setIsSubmitting(false);
      }
    }

    const isPasswordValid = password.length >= 8 || password.length === 0;
    const isFormValid = username.length > 0 && password.length >= 8;

  return (
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
        onClick={submitClicked}
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
  );
}

export default UserForm;