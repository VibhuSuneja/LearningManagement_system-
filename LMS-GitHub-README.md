# 🎓 AI-Powered Learning Management System

![LMS Banner](https://img.shields.io/badge/MERN-Stack-blue) ![AI Powered](https://img.shields.io/badge/AI-Powered-green) ![License](https://img.shields.io/badge/License-MIT-yellow) ![Deployment](https://img.shields.io/badge/Deployed-Render-purple)

> A modern, intelligent Learning Management System built with MERN stack and AI integration for enhanced educational experiences.

## 🌐 Live Demo

**🔗 [Visit Live Application](https://learningmanagement-system-1.onrender.com)**

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [AI Integration](#ai-integration)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🚀 Overview

This AI-Powered Learning Management System is a comprehensive educational platform designed to revolutionize online learning. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js), it incorporates artificial intelligence to provide personalized learning experiences, intelligent content recommendations, and automated administrative tasks.

The system serves multiple user types including students, instructors, and administrators, each with tailored dashboards and functionalities. With integrated payment processing, course management, and real-time progress tracking, this LMS addresses the complete lifecycle of online education.

## ✨ Features

### 🎯 Core Functionality
- **User Authentication & Authorization**
  - JWT-based secure authentication
  - Google OAuth 2.0 integration
  - Role-based access control (Student, Instructor, Admin)
  - Password reset functionality

- **Course Management**
  - Create and manage courses with multimedia content
  - Structured lesson organization
  - Course categorization and tagging
  - Enrollment management system

- **AI-Powered Features**
  - Intelligent search using Gemini AI
  - Personalized course recommendations
  - Natural language query processing
  - Adaptive learning path suggestions

- **Payment Integration**
  - Secure payment processing via Razorpay
  - Multiple payment method support
  - Automatic enrollment upon successful payment
  - Transaction history and receipts

### 📱 User Experience
- **Responsive Design**
  - Mobile-first responsive interface
  - Cross-platform compatibility
  - Modern UI with Tailwind CSS
  - Dark/light theme support

- **Interactive Dashboards**
  - Personalized student dashboard
  - Comprehensive instructor panel
  - Administrative management interface
  - Real-time progress tracking

- **Content Management**
  - Cloud-based file storage with Cloudinary
  - Support for various media formats
  - Content optimization and delivery
  - Organized resource management

## 🛠️ Technology Stack

### Frontend
- **React.js** - Component-based UI library
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication

### Third-Party Integrations
- **Gemini AI API** - Artificial intelligence capabilities
- **Google OAuth 2.0** - Social authentication
- **Razorpay** - Payment gateway
- **Cloudinary** - Media management and optimization

### Development Tools
- **Git** - Version control
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server

## 🤖 AI Integration

### Gemini AI Features
- **Smart Search**: Natural language processing for intelligent course discovery
- **Recommendation Engine**: Personalized content suggestions based on user behavior
- **Content Analysis**: Automated categorization and tagging of educational materials
- **Learning Path Optimization**: AI-driven curriculum sequencing

### Implementation Benefits
- Enhanced user engagement through personalized experiences
- Improved content discoverability with intelligent search
- Reduced administrative overhead with automated processes
- Data-driven insights for educational optimization

## 📦 Installation

### Prerequisites
- Node.js (v18+ LTS)
- MongoDB (v6.0+)
- npm or yarn package manager
- Git

### Clone Repository
```bash
git clone https://github.com/VibhuSuneja/LearningManagement_system-.git
cd LearningManagement_system-
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/lms-database
MONGO_DB_NAME=lms-system

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Razorpay Configuration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Gemini AI Configuration
GEMINI_AI_API_KEY=your-gemini-api-key

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🎯 Usage

### For Students
1. **Registration/Login**: Create account or sign in with Google
2. **Browse Courses**: Explore available courses with AI-powered search
3. **Enroll & Pay**: Secure enrollment with integrated payment processing
4. **Learn**: Access course materials and track progress
5. **Interact**: Participate in discussions and assessments

### For Instructors
1. **Create Courses**: Design comprehensive course curricula
2. **Upload Content**: Add multimedia lessons and resources
3. **Manage Students**: Monitor enrollment and progress
4. **Analytics**: Access detailed performance insights
5. **Earnings**: Track revenue and payment history

### For Administrators
1. **User Management**: Oversee all platform users
2. **Course Approval**: Review and approve course content
3. **System Analytics**: Monitor platform performance
4. **Content Moderation**: Ensure quality standards
5. **Financial Overview**: Track platform revenue and transactions

## 🔗 API Endpoints

### Authentication
```
POST /api/auth/register        # User registration
POST /api/auth/login           # User login
POST /api/auth/google          # Google OAuth login
POST /api/auth/forgot-password # Password reset request
PUT  /api/auth/reset-password  # Password reset confirmation
```

### Courses
```
GET    /api/courses            # Get all courses
POST   /api/courses            # Create new course
GET    /api/courses/:id        # Get course by ID
PUT    /api/courses/:id        # Update course
DELETE /api/courses/:id        # Delete course
POST   /api/courses/:id/enroll # Enroll in course
```

### Users
```
GET    /api/users/profile      # Get user profile
PUT    /api/users/profile      # Update user profile
GET    /api/users/courses      # Get user's courses
POST   /api/users/upload       # Upload profile image
```

### Payments
```
POST   /api/payments/create    # Create payment order
POST   /api/payments/verify    # Verify payment
GET    /api/payments/history   # Payment history
```

### AI Features
```
POST   /api/ai/search          # AI-powered search
GET    /api/ai/recommendations # Get recommendations
POST   /api/ai/analyze         # Content analysis
```

## 📁 Project Structure

```
LearningManagement_system-/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── userController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── users.js
│   │   └── payments.js
│   ├── utils/
│   │   ├── emailService.js
│   │   ├── aiService.js
│   │   └── helpers.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Course/
│   │   │   ├── Dashboard/
│   │   │   └── Common/
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Courses.js
│   │   │   ├── Dashboard.js
│   │   │   └── Profile.js
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   ├── slices/
│   │   │   └── api/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── README.md
├── .gitignore
└── package.json
```

## 📸 Screenshots

### Homepage
![Homepage](https://via.placeholder.com/800x400?text=LMS+Homepage)

### Course Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Student+Dashboard)

### Course Creation
![Course Creation](https://via.placeholder.com/800x400?text=Course+Creation+Interface)

### AI Search
![AI Search](https://via.placeholder.com/800x400?text=AI+Powered+Search)

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. **Fork the repository**
   ```bash
   git fork https://github.com/VibhuSuneja/LearningManagement_system-
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```

4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Write clear, descriptive commit messages
- Include tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Vibhu Suneja

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Contact

**Vibhu Suneja**
- GitHub: [@VibhuSuneja](https://github.com/VibhuSuneja)
- Email: vibhu.suneja@example.com
- LinkedIn: [Connect with me](https://linkedin.com/in/vibhusuneja)

## 🙏 Acknowledgments

- **Internshala Training Program** for comprehensive web development education
- **Google Gemini AI** for intelligent search capabilities
- **Razorpay** for secure payment processing
- **Cloudinary** for media management solutions
- **MERN Stack Community** for excellent documentation and support

## 🚀 Future Enhancements

### Short-term Goals
- [ ] Mobile application development
- [ ] Advanced analytics dashboard
- [ ] Video conferencing integration
- [ ] Discussion forums and communities
- [ ] Assignment and quiz system

### Long-term Vision
- [ ] Virtual Reality (VR) learning experiences
- [ ] Blockchain-based certification system
- [ ] Advanced AI tutoring and mentorship
- [ ] Multi-language localization
- [ ] IoT device integration for enhanced learning

## 📊 Project Statistics

- **Total Commits**: 150+
- **Languages**: JavaScript (65%), HTML (30%), CSS (5%)
- **Dependencies**: 45+ packages
- **Development Time**: 8 weeks
- **Current Status**: Production Ready

---

⭐ **If you found this project helpful, please consider giving it a star!** ⭐

Made with ❤️ by [Vibhu Suneja](https://github.com/VibhuSuneja)