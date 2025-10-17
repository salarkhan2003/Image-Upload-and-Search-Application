# Image Upload Frontend

React.js frontend for the Image Upload and Search application.

## Features

- Modern React with hooks and functional components
- Responsive design with mobile support
- Drag & drop image upload
- Real-time search with suggestions
- Lazy loading image grid
- Image optimization and preview
- Error handling and user feedback
- Accessibility compliant

## Prerequisites

- Node.js 18+
- Backend API running (see backend README)

## Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Image Upload & Search
REACT_APP_VERSION=1.0.0
```

## Development

Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Build

Create production build:
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # Navigation header
│   ├── ImageGrid.js    # Image display grid
│   ├── ImageUpload.js  # File upload component
│   └── SearchBar.js    # Search input component
├── context/            # React Context for state management
│   └── ImageContext.js # Global image state
├── pages/              # Page components
│   ├── HomePage.js     # Landing page
│   ├── SearchPage.js   # Search and browse images
│   └── UploadPage.js   # Upload images
├── services/           # API and utility services
│   └── api.js          # API client and utilities
├── App.js              # Main app component
├── index.js            # App entry point
└── index.css           # Global styles
```

## Components

### ImageUpload
- Drag & drop file upload
- File validation (type, size)
- Multiple file support
- Keyword tagging
- Upload progress
- Error handling

### ImageGrid
- Responsive grid layout
- Lazy loading with intersection observer
- Image modal view
- Download functionality
- Keyword display

### SearchBar
- Real-time search with debouncing
- Search suggestions
- Query history
- Mobile-friendly input

## State Management

Uses React Context for global state:
- Image collections
- Search results
- Loading states
- Error handling
- Pagination data

## Styling

- Custom CSS with utility classes
- Responsive design (mobile-first)
- Modern UI with shadows and transitions
- Accessible color contrast
- Loading animations

## API Integration

- Axios for HTTP requests
- Request/response interceptors
- Error handling
- File upload with progress
- Automatic retry logic

## Performance Optimizations

- Lazy loading images
- Debounced search
- Memoized components
- Optimized re-renders
- Code splitting (ready for implementation)

## Deployment

### Netlify
1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify
3. Set environment variables in Netlify dashboard
4. Configure redirects for SPA routing

Create `public/_redirects` file:
```
/*    /index.html   200
```

### Vercel
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

Build settings:
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| REACT_APP_API_URL | Backend API URL | Yes |
| REACT_APP_NAME | Application name | No |
| REACT_APP_VERSION | App version | No |
| REACT_APP_ENABLE_MULTIPLE_UPLOAD | Enable multiple file upload | No |
| REACT_APP_MAX_FILE_SIZE | Max file size in bytes | No |
| REACT_APP_ALLOWED_FILE_TYPES | Allowed MIME types | No |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility Features

- Keyboard navigation
- Screen reader support
- ARIA labels and roles
- Focus management
- High contrast support
- Semantic HTML structure

## Testing

Run tests:
```bash
npm test
```

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure backend CORS is configured for frontend URL
2. **API connection**: Check REACT_APP_API_URL environment variable
3. **File upload fails**: Verify file size and type restrictions
4. **Images not loading**: Check S3 bucket permissions and signed URLs

### Debug Mode

Set `NODE_ENV=development` to enable:
- Detailed error messages
- Console logging
- Development tools