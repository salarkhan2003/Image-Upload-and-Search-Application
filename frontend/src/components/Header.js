import { Link, useLocation } from 'react-router-dom';
import { Camera, Search, Upload, Home } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    background: 'rgba(15, 33, 55, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(192, 192, 192, 0.1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const logoTextStyle = {
    background: 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '24px',
    fontWeight: 900,
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '-0.025em',
    textTransform: 'uppercase',
  };

  const navLinkStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: active 
      ? 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)'
      : 'transparent',
    color: active ? '#121212' : '#C0C0C0',
    border: active ? 'none' : '1px solid rgba(192, 192, 192, 0.2)',
    boxShadow: active ? '0 4px 12px rgba(0, 240, 255, 0.3)' : 'none',
  });

  return (
    <header style={headerStyle}>
      <div className="container">
        <nav style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          height: '80px',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          {/* Logo */}
          <Link to="/" style={logoStyle}>
            <Camera size={32} style={{ color: '#00F0FF' }} />
            <span style={logoTextStyle}>IMAGEVAULT</span>
          </Link>

          {/* Navigation Links */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            flexWrap: 'wrap',
          }}>
            <Link
              to="/"
              style={navLinkStyle(isActive('/'))}
              onMouseEnter={(e) => {
                if (!isActive('/')) {
                  e.target.style.background = 'rgba(192, 192, 192, 0.1)';
                  e.target.style.color = '#FFFFFF';
                  e.target.style.borderColor = '#00F0FF';
                  e.target.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/')) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#C0C0C0';
                  e.target.style.borderColor = 'rgba(192, 192, 192, 0.2)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              <Home size={18} />
              <span className="hidden sm:inline">HOME</span>
            </Link>

            <Link
              to="/upload"
              style={navLinkStyle(isActive('/upload'))}
              onMouseEnter={(e) => {
                if (!isActive('/upload')) {
                  e.target.style.background = 'rgba(192, 192, 192, 0.1)';
                  e.target.style.color = '#FFFFFF';
                  e.target.style.borderColor = '#00F0FF';
                  e.target.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/upload')) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#C0C0C0';
                  e.target.style.borderColor = 'rgba(192, 192, 192, 0.2)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              <Upload size={18} />
              <span className="hidden sm:inline">UPLOAD</span>
            </Link>

            <Link
              to="/search"
              style={navLinkStyle(isActive('/search'))}
              onMouseEnter={(e) => {
                if (!isActive('/search')) {
                  e.target.style.background = 'rgba(192, 192, 192, 0.1)';
                  e.target.style.color = '#FFFFFF';
                  e.target.style.borderColor = '#00F0FF';
                  e.target.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/search')) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#C0C0C0';
                  e.target.style.borderColor = 'rgba(192, 192, 192, 0.2)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              <Search size={18} />
              <span className="hidden sm:inline">SEARCH</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;