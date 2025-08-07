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
    const [color, setColor] = useState("#333366"); // Default to app's blue color
    
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
    <div className="space-y-3 sm:space-y-4">
      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="signup-email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value) }}
          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>
      
      <div>
        <label htmlFor="signup-username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input
          id="signup-username"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => { setUsername(e.target.value) }}
          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
          <div className="relative" ref={emojiPickerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors flex items-center justify-between"
            >
              <span className="text-lg sm:text-xl">{character || "Select emoji"}</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            {showEmojiPicker && (
              <div className="absolute z-10 mt-1 left-0 right-0 sm:left-auto sm:right-auto">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    width={Math.min(320, window.innerWidth - 32)}
                    height={350}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <div className="relative" ref={colorPickerRef}>
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center min-w-0">
                <div
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded mr-2 border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="truncate text-xs sm:text-sm">{color}</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            {showColorPicker && (
              <div className="absolute z-10 mt-1 left-0 right-0 sm:left-auto sm:right-auto">
                <div className="p-3 sm:p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                  <HexColorPicker
                    color={color}
                    onChange={setColor}
                    style={{ width: '100%', height: '150px' }}
                  />
                  <div className="mt-2 sm:mt-3 flex justify-between items-center">
                    <div
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-md border border-gray-300 mr-2 flex-shrink-0"
                      style={{ backgroundColor: color }}
                    ></div>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded min-w-0"
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
        className="w-full bg-blue-600 text-white py-2.5 sm:py-2 px-4 text-sm sm:text-base rounded-md hover:bg-[#282850] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium mt-2"
      >
        Create Account
      </button>
    </div>
  );
}

export default UserForm;