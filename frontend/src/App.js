import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import UploadPage from './pages/UploadPage';
import { ImageProvider } from './context/ImageContext';

function App() {
  return (
    <ImageProvider>
      <Router>
        <div style={{ minHeight: '100vh', position: 'relative' }}>
          <Header />
          <main className="container" style={{ position: 'relative', zIndex: 10 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(15, 33, 55, 0.95)',
                color: '#FFFFFF',
                border: '1px solid rgba(192, 192, 192, 0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(20px)',
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#00F0FF',
                  secondary: '#121212',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ff6b6b',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />
        </div>
      </Router>
    </ImageProvider>
  );
}

export default App;