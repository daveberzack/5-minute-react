import { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import AllGames from "./AllGames";
import FavoriteGames from "./FavoriteGames";
import Login from "./Login";

function AddCustomLink({ onAddLink }) {
  const emojiPickerRef = useRef(null);
  const colorPickerRef = useRef(null);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [emoji, setEmoji] = useState('🎮');
  const [backgroundColor, setBackgroundColor] = useState('#4F46E5');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && url.trim()) {
      onAddLink({
        name: name.trim(),
        url: url.trim(),
        emoji: emoji,
        backgroundColor: backgroundColor
      });
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
    <div className="bg-blue-100" style={{ margin: '0.3125rem', borderRadius: '0.3125rem', padding: '1.5rem' }}>
      <h3 className="text-blue-800 text-lg font-bold mb-4">Add Custom Link</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
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

function Games() {
  const [activeTab, setActiveTab] = useState('all');
  const [customLinks, setCustomLinks] = useState(() => {
    const saved = localStorage.getItem('customLinks');
    return saved ? JSON.parse(saved) : [];
  });

  const handleAddCustomLink = (link) => {
    const newLink = {
      ...link,
      id: Date.now(), // Simple ID generation
      isCustom: true
    };
    const updatedLinks = [...customLinks, newLink];
    setCustomLinks(updatedLinks);
    localStorage.setItem('customLinks', JSON.stringify(updatedLinks));
    setActiveTab('liked'); // Switch to liked tab to show the new link
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'liked', label: 'Liked' },
    { id: 'add', label: 'Add' },
    { id: 'login', label: 'Login' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'all':
        return <AllGames />;
      case 'liked':
        return <FavoriteGames customLinks={customLinks} />;
      case 'add':
        return <AddCustomLink onAddLink={handleAddCustomLink} />;
      case 'login':
        return (
          <div style={{ margin: '0.3125rem' }}>
            <div className="bg-blue-100" style={{ borderRadius: '0.3125rem', padding: '1.5rem' }}>
              <div className="max-w-md mx-auto">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H19V9Z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-blue-800 mb-1">Login Placeholder</h3>
                  <p className="text-blue-600 text-sm">This is a placeholder for the login form</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <button className="w-full bg-blue-800 text-white py-2.5 px-4 text-sm rounded-lg font-medium hover:bg-blue-900 transition-colors duration-200">
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <AllGames />;
    }
  };

  return (
    <section id="games" className="p-0 m-0">
      {/* Tab navigation */}
      <div className="flex justify-start items-start gap-2" style={{ margin: '0.3125rem', marginBottom: 0 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-bold transition-colors duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-blue-800 shadow-sm'
                : 'bg-blue-800 text-white hover:bg-blue-700'
            }`}
            style={{ borderRadius: '0.3125rem 0.3125rem 0 0' }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab content */}
      {renderTabContent()}
    </section>
  );
}

export default Games;