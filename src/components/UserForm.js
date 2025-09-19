import {useState, useEffect, useRef} from 'react';
import EmojiPicker from 'emoji-picker-react';
import { HexColorPicker } from 'react-colorful';

function UserForm({
  submitForm
}) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [character, setCharacter] = useState("");
    const [color, setColor] = useState("#4a90e2"); // Default to app's blue color
    
    // Handle clicking outside the pickers to close them
    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
                setShowColorPicker(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    

    // State for showing/hiding pickers
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    
    // Refs for click-outside detection
    const emojiPickerRef = useRef(null);
    const colorPickerRef = useRef(null);

    // Handle emoji selection
    const onEmojiClick = (emojiData, event) => {
        console.log("Emoji selected:", emojiData.emoji);
        setCharacter(emojiData.emoji);
        setShowEmojiPicker(false);
    };

    const submitClicked = ()=> {
      submitForm(email, password, username, character, color);
    }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input
          id="signup-email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value) }}
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Choose Emoji</label>
          <div className="relative" ref={emojiPickerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="form-input w-full px-3 py-2.5 text-sm rounded-lg shadow-sm focus:outline-none transition-all duration-300 flex items-center justify-between hover:scale-105"
            >
              <span className="text-lg">{character || "🎮"}</span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showEmojiPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            {showEmojiPicker && (
              <div className="absolute z-20 mt-1 left-0 right-0 sm:left-auto sm:right-auto">
                <div className="glass-card rounded-xl shadow-xl border border-white/20 overflow-hidden">
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    width={Math.min(300, window.innerWidth - 32)}
                    height={300}
                    emojiStyle="native"
                    autoFocusSearch={false}
                    lazyLoadEmojis={true}
                    searchDisabled={false}
                    skinTonesDisabled={true}
                    previewConfig={{ showPreview: false }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pick Color</label>
          <div className="relative" ref={colorPickerRef}>
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="form-input w-full px-3 py-2.5 text-sm rounded-lg shadow-sm focus:outline-none transition-all duration-300 flex items-center justify-between hover:scale-105"
            >
              <div className="flex items-center min-w-0">
                <div
                  className="w-5 h-5 rounded border-2 border-white shadow-sm mr-2 flex-shrink-0"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="truncate text-xs font-medium">{color}</span>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showColorPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            {showColorPicker && (
              <div className="absolute z-20 mt-1 left-0 right-0 sm:left-auto sm:right-auto">
                <div className="glass-card p-3 rounded-xl shadow-xl border border-white/20">
                  <HexColorPicker
                    color={color}
                    onChange={setColor}
                    style={{ width: '100%', height: '120px' }}
                  />
                  <div className="mt-3 flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded border-2 border-white shadow-sm flex-shrink-0"
                      style={{ backgroundColor: color }}
                    ></div>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="form-input flex-1 px-2 py-1.5 text-xs rounded min-w-0"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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