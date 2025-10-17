# Image Upload and Search Application

A production-ready full-stack web application for uploading images to AWS S3 and searching them by keywords. Built for internship evaluation with modern technologies and best practices.

## 🚀 Live Demo
- **Frontend**: [Deploy your own](https://netlify.com) 
- **Backend API**: [Deploy your own](https://railway.app)

## 🛠 Tech Stack
- **Frontend**: React.js 18+ with hooks and functional components
- **Backend**: Node.js with Express.js
- **Storage**: AWS S3 with image optimization
- **Database**: In-memory storage (easily extensible to MongoDB/PostgreSQL)
- **Deployment**: Frontend on Netlify/Vercel, Backend on Railway/Render

## ✨ Features

### Core Functionality
- 📤 **Image Upload**: Drag & drop interface with multiple file support
- 🔍 **Keyword Search**: Real-time search with suggestions and pagination
- 🖼️ **Image Display**: Responsive grid with lazy loading and modal view
- 🏷️ **Tagging System**: Add keywords for better searchability

### Technical Features
- 🔒 **Security**: File validation, rate limiting, CORS protection
- ⚡ **Performance**: Image compression, lazy loading, debounced search
- 📱 **Responsive**: Mobile-first design with touch-friendly interface
- ♿ **Accessibility**: Screen reader support, keyboard navigation
- 🎨 **Modern UI**: Clean design with loading states and animations

## 📁 Project Structure
```
image-upload-search/
├── backend/                 # Express.js API server
│   ├── config/             # AWS and app configuration
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Custom middleware
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── validators/         # Input validation
│   └── server.js           # Entry point
├── frontend/               # React.js application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context for state
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client and utilities
│   │   └── App.js          # Main app component
├── deployment/             # Deployment configurations
│   ├── netlify.toml        # Netlify config
│   ├── vercel.json         # Vercel config
│   ├── railway.toml        # Railway config
│   └── render.yaml         # Render config
├── DEPLOYMENT.md           # Detailed deployment guide
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- AWS Account with S3 access
- Git

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/image-upload-search.git
cd image-upload-search
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your AWS credentials in .env
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Configure API URL in .env
npm start
```

### 4. AWS S3 Configuration
1. Create S3 bucket
2. Configure CORS and permissions
3. Create IAM user with S3 access
4. Add credentials to backend `.env`

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed setup instructions.

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/upload` | Upload single image |
| POST | `/api/upload/multiple` | Upload multiple images |
| GET | `/api/images` | Get all images (paginated) |
| GET | `/api/images/:id` | Get single image |
| GET | `/api/search` | Search images by keywords |
| GET | `/api/stats` | Get upload statistics |

## 🎯 Key Features Implementation

### Image Upload
- **Validation**: File type, size, and count limits
- **Optimization**: Automatic compression with Sharp
- **Security**: Secure S3 upload with unique keys
- **Progress**: Real-time upload progress tracking

### Search Functionality
- **Real-time**: Debounced search with instant results
- **Suggestions**: Smart keyword suggestions
- **Pagination**: Efficient pagination for large datasets
- **Filtering**: Search by keywords, filename, or metadata

### User Experience
- **Responsive**: Works on all device sizes
- **Accessible**: WCAG compliant with keyboard navigation
- **Fast**: Lazy loading and optimized images
- **Intuitive**: Clean UI with helpful feedback

## 🚀 Deployment

### Production Deployment
1. **Backend**: Deploy to Railway or Render
2. **Frontend**: Deploy to Netlify or Vercel
3. **Storage**: Configure AWS S3 bucket
4. **Environment**: Set production environment variables

### Environment Variables

**Backend**:
```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket
FRONTEND_URL=https://your-app.netlify.app
```

**Frontend**:
```env
REACT_APP_API_URL=https://your-api.railway.app/api
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Manual Testing
1. Upload various image formats and sizes
2. Test search functionality with different keywords
3. Verify responsive design on mobile devices
4. Test error handling scenarios

## 📈 Performance Optimizations

- **Image Compression**: Automatic optimization with Sharp
- **Lazy Loading**: Images load as they enter viewport
- **Debounced Search**: Reduces API calls during typing
- **Caching**: Proper cache headers for static assets
- **CDN Ready**: S3 integration works with CloudFront

## 🔒 Security Features

- **File Validation**: Strict file type and size checking
- **Rate Limiting**: Prevents API abuse
- **CORS Protection**: Configured for specific origins
- **Input Sanitization**: All inputs validated with Joi
- **Secure Headers**: Helmet.js security headers

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Animations**: Smooth transitions and hover effects
- **Mobile First**: Optimized for mobile devices

## 🔄 Future Enhancements

- [ ] User authentication and authorization
- [ ] AI-powered image tagging with AWS Rekognition
- [ ] Bulk operations (delete, download)
- [ ] Image editing capabilities
- [ ] Advanced search filters
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Real-time notifications
- [ ] Image collections/albums

## 📝 Documentation

- [Backend README](backend/README.md) - API documentation and setup
- [Frontend README](frontend/README.md) - React app documentation
- [Deployment Guide](DEPLOYMENT.md) - Production deployment instructions

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Internship Evaluation Criteria

This project demonstrates:
- ✅ **Full-stack Development**: React + Node.js + AWS
- ✅ **Modern Practices**: Hooks, functional components, ES6+
- ✅ **Production Ready**: Error handling, validation, security
- ✅ **Scalable Architecture**: Modular code, separation of concerns
- ✅ **User Experience**: Responsive design, accessibility
- ✅ **Cloud Integration**: AWS S3, deployment platforms
- ✅ **Documentation**: Comprehensive README and guides

## 📞 Support

For questions or issues:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed description

---

**Built with ❤️ for internship evaluation at ChitraLai**