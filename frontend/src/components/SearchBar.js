import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { utils } from '../services/api';

const SearchBar = ({ onSearch, initialQuery = '', placeholder = "Search images by keywords..." }) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions] = useState([
    'beach sunset', 'black t-shirt', 'mountain landscape', 'city skyline',
    'food photography', 'nature', 'portrait', 'architecture', 'animals',
    'flowers', 'cars', 'technology', 'art', 'travel'
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced search function
  const debouncedSearch = utils.debounce((searchQuery) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  }, 500);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      debouncedSearch(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    onSearch('');
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase()) && 
    suggestion.toLowerCase() !== query.toLowerCase()
  ).slice(0, 6);

  const searchBarStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
  };

  const inputStyle = {
    width: '100%',
    padding: '20px 60px 20px 60px',
    background: 'rgba(15, 33, 55, 0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(192, 192, 192, 0.2)',
    borderRadius: '12px',
    color: '#FFFFFF',
    fontSize: '18px',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
  };

  const iconStyle = {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#00F0FF',
    pointerEvents: 'none',
  };

  const clearButtonStyle = {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    color: '#C0C0C0',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const suggestionsStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '8px',
    background: 'rgba(15, 33, 55, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(192, 192, 192, 0.2)',
    borderRadius: '12px',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.3)',
    zIndex: 50,
    maxHeight: '320px',
    overflowY: 'auto',
  };

  const suggestionItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    color: '#C0C0C0',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    borderBottom: '1px solid rgba(192, 192, 192, 0.1)',
    fontSize: '16px',
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <div style={searchBarStyle} className="animate-slide-up">
      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <Search size={24} style={iconStyle} />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder={placeholder}
            style={inputStyle}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#00F0FF';
              e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 240, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              if (document.activeElement !== e.target) {
                e.target.style.borderColor = 'rgba(192, 192, 192, 0.2)';
                e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
              }
            }}

          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              style={clearButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.color = '#FFFFFF';
                e.target.style.background = 'rgba(192, 192, 192, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#C0C0C0';
                e.target.style.background = 'transparent';
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Mobile Search Button */}
        <button
          type="submit"
          style={{
            display: 'none',
            width: '100%',
            marginTop: '16px',
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)',
            color: '#121212',
            border: 'none',
            borderRadius: '12px',
            fontFamily: "'Inter', sans-serif",
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="md:hidden"
        >
          SEARCH IMAGES
        </button>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && (query.length > 0 || filteredSuggestions.length > 0) && (
        <div style={suggestionsStyle} className="animate-scale-in">
          {query.length > 0 && (
            <div style={{
              padding: '16px 20px',
              fontSize: '14px',
              color: '#00F0FF',
              borderBottom: '1px solid rgba(192, 192, 192, 0.1)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              SEARCH SUGGESTIONS
            </div>
          )}
          
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                style={suggestionItemStyle}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(192, 192, 192, 0.1)';
                  e.target.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#C0C0C0';
                }}
              >
                <Search size={18} style={{ color: '#00F0FF', marginRight: '12px' }} />
                <span>{suggestion}</span>
              </button>
            ))
          ) : query.length > 0 && (
            <div style={{
              padding: '16px 20px',
              fontSize: '14px',
              color: '#C0C0C0',
            }}>
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;