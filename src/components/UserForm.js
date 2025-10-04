import {useState} from 'react';

function UserForm({
  submitForm
}) {

    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const submitClicked = ()=> {
      submitForm(username, password);
    }

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
          className="form-input w-full px-3 py-2.5 text-sm rounded-lg shadow-sm focus:outline-none transition-all duration-300"
        />
      </div>
      
      <button
        onClick={submitClicked}
        className="btn-gradient w-full py-2.5 px-4 text-sm rounded-lg font-medium shadow-md mt-4"
      >
        Create Account
      </button>
    </div>
  );
}

export default UserForm;