import { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { localStorageService } from '../services/localStorageService';

function AddCustomLink() {
  // Form state
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [emoji, setEmoji] = useState('🎮');
  const [backgroundColor, setBackgroundColor] = useState('#4F46E5');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Refs for click outside detection
  const emojiPickerRef = useRef(null);
  const colorPickerRef = useRef(null);
  
  // Web-safe color palette
  const webSafeColors = [
    '#FF0000', '#FF3300', '#FF6600', '#FF9900', '#FFCC00', '#FFFF00',
    '#CCFF00', '#99FF00', '#66FF00', '#33FF00', '#00FF00', '#00FF33',
    '#00FF66', '#00FF99', '#00FFCC', '#00FFFF', '#00CCFF', '#0099FF',
    '#0066FF', '#0033FF', '#0000FF', '#3300FF', '#6600FF', '#9900FF',
    '#CC00FF', '#FF00FF', '#FF00CC', '#FF0099', '#FF0066', '#FF0033',
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
    '#C0C0C0', '#808080', '#FF6666', '#66FF66', '#6666FF', '#FFFF66',
    '#FF66FF', '#66FFFF', '#990000', '#009900', '#000099', '#999900',
    '#990099', '#009999', '#CC0000', '#00CC00', '#0000CC', '#CCCC00',
    '#CC00CC', '#00CCCC'
  ];

  const handleAddCustomLink = (e) => {
    e.preventDefault();
    if (name.trim() && url.trim()) {
      
      const newLink = {
        name: name.trim(),
        url: url.trim(),
        emoji: emoji,
        backgroundColor: backgroundColor,
        id: Date.now(),
        isCustom: true
      };
      
      // Add new link using localStorage service
      localStorageService.addCustomLink(newLink);
      
      // Reset form
      setName('');
      setUrl('');
      setEmoji('🎮');
      setBackgroundColor('#4F46E5');
      setShowEmojiPicker(false);
      setShowColorPicker(false);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setEmoji(emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="mt-4 bg-blue-100" style={{ borderRadius: '0.3125rem', padding: '1.5rem' }}>
      <h3 className="text-blue-800 text-lg font-bold mb-4">Add Custom Link</h3>
      <form onSubmit={handleAddCustomLink} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-blue-800 font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter game name"
            required
          />
        </div>
        
        <div>
          <label htmlFor="url" className="block text-blue-800 font-medium mb-2">
            URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
            required
          />
        </div>
        
        <div className="relative" ref={emojiPickerRef}>
          <label className="block text-blue-800 font-medium mb-2">
            Emoji
          </label>
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-blue-50 transition-colors duration-200 flex items-center justify-between"
          >
            <span className="flex items-center space-x-2">
              <span className="text-2xl">{emoji}</span>
              <span className="text-blue-800">Click to choose emoji</span>
            </span>
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showEmojiPicker && (
            <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-blue-300 rounded-lg shadow-lg">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                width={300}
                height={400}
                previewConfig={{
                  showPreview: false
                }}
              />
            </div>
          )}
        </div>

        <div className="relative" ref={colorPickerRef}>
          <label className="block text-blue-800 font-medium mb-2">
            Background Color
          </label>
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-blue-50 transition-colors duration-200 flex items-center justify-between"
          >
            <span className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-lg shadow-sm"
                style={{ backgroundColor: backgroundColor }}
              >
                {emoji}
              </div>
              <span className="text-blue-800">Click to choose color</span>
              <span className="text-blue-600 text-sm font-mono">{backgroundColor}</span>
            </span>
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showColorPicker && (
            <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-blue-300 rounded-lg shadow-lg p-4">
              <div className="grid grid-cols-12 gap-1 max-w-xs">
                {webSafeColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setBackgroundColor(color);
                      setShowColorPicker(false);
                    }}
                    className={`w-6 h-6 rounded border-2 transition-all duration-200 hover:scale-110 ${
                      backgroundColor === color ? 'border-blue-800 shadow-lg' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-900 transition-colors duration-200"
        >
          Add Link
        </button>
      </form>
    </div>
  );
}

export default AddCustomLink;