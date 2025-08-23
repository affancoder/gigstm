# GigsTM - Version 2.0

<div align="center">
  <img src="GigsTm_files/lgo_project1.png" alt="GigsTM Logo" width="200">
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  ![Version](https://img.shields.io/badge/version-2.0.0-blue)
  ![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
  
  **A modern freelancing platform connecting businesses with top talent**
  
  ---
  
  ### 🏆 Special Thanks & Recognition
  
  This project is the brainchild of **MD Affan Asghar**, whose vision and dedication have been the driving force behind GigsTM. Special recognition for:
  
  - **Visionary Leadership** in creating a platform that bridges the gap between talent and opportunity
  - **Technical Excellence** in implementing a robust MERN stack solution
  - **User-Centric Design** that prioritizes both client and freelancer experience
  - **Relentless Innovation** in continuously improving platform features
  
  *"Great things in business are never done by one person. They're done by a team of people."* - Steve Jobs
  
  ---
</div>

## 🚀 Overview

GigsTM is a comprehensive freelancing platform that bridges the gap between businesses and skilled professionals. Spearheaded by MD Affan Asghar, Version 2.0 brings enhanced features, improved security, and a better user experience. Our platform is built with cutting-edge technologies to provide a seamless experience for both clients and freelancers.

## ✨ Key Features

### 🔐 Authentication & Security
- **Secure User Authentication** with Firebase
- **Email/Password** and **Social Login** options
- **Forgot Password** with secure reset flow
- **Email Verification** for new accounts
- **Session Management** with Firebase Auth

### 👤 User Profile Management
- **Complete Profile Setup** with professional portfolio
- **Skill Endorsements** and **Ratings**
- **Work History** and **Portfolio Showcase**
- **Contact Information** management

### 💼 Job Management
- **Job Posting** with detailed requirements
- **Proposal Submission** for freelancers
- **Milestone-based Payments**
- **Real-time Chat** between clients and freelancers
- **Review & Rating System**

### 🔍 Smart Search & Filters
- **Advanced Search** by skills, location, and budget
- **Category-based Browsing**
- **Saved Searches** and **Job Alerts**
- **Recommended Jobs** based on profile

## 🛠️ Technologies Used

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)**
- **Firebase Authentication**
- **Firebase Firestore** (NoSQL Database)
- **Firebase Storage** (For file uploads)
- **jQuery** (For DOM manipulation)
- **Slick Carousel** (For interactive sliders)

### Backend
- **Node.js & Express.js** for server-side logic
- **MongoDB** with Mongoose ODM
- **JWT Authentication** for secure access
- **Cloudinary** for media storage
- **RESTful API** architecture

### Development Tools
- **Git** (Version Control)
- **VS Code** (Code Editor)
- **Chrome DevTools** (Debugging)
- **Firebase CLI** (Deployment)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm (v6+)
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/gigstm.git
   cd gigstm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password, Google)
   - Set up Firestore Database
   - Configure Storage rules

4. **Configure environment**
   Create a `.env` file in the root directory with your Firebase config:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

5. **Run locally**
   ```bash
   firebase serve
   ```
   or
   ```bash
   npm start
   ```

## 📱 Features in Detail

### User Authentication
- Secure signup with email verification
- Password reset functionality
- Social login integration (Google, GitHub, etc.)
- Session persistence

### Profile Management
- Professional profile creation
- Portfolio showcase
- Skill endorsements
- Work history and education

### Job Marketplace
- Post jobs with detailed requirements
- Browse and apply for jobs
- Manage applications
- Track project progress

### Messaging System
- Real-time chat
- File sharing
- Notifications

### Payment Integration
- Secure escrow payments
- Multiple payment methods
- Invoicing system

## 📂 Project Structure

```
gigstm/
├── public/                  # Static files
│   ├── index.html           # Main HTML file
│   ├── assets/              # Images, fonts, etc.
│   └── favicon.ico          # Favicon
├── src/                     # Source files
│   ├── assets/              # Static assets
│   ├── components/          # Reusable components
│   ├── pages/               # Page components
│   ├── services/            # API and service files
│   ├── styles/              # Global styles
│   ├── utils/               # Utility functions
│   ├── App.js               # Main App component
│   └── index.js             # Entry point
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── firebase.json           # Firebase configuration
├── package.json            # Project dependencies
└── README.md               # This file
```

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run deploy` - Deploy to Firebase hosting

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com/) for the amazing backend services
- [Font Awesome](https://fontawesome.com/) for the icons
- [Slick Carousel](https://kenwheeler.github.io/slick/) for the carousel components

## 👨‍💻 About the Creator

**MD Affan Asghar** is a passionate full-stack developer with expertise in modern web technologies. His dedication to creating impactful solutions is evident in the GigsTM platform.

### Connect with Affan
- 📧 Email: [affanasgar8@gmail.com](mailto:affanasgar8@gmail.com)
- 💼 LinkedIn: [MD Affan Asghar](https://www.linkedin.com/in/your-linkedin)
- 🐱 GitHub: [@affancoder](https://github.com/affancoder)
- 🌐 Portfolio: [affancoder.dev](https://affancoder.dev) (example)

## 🌟 Project Showcase

Experience GigsTM live: [https://gigstm-v2.vercel.app/](https://gigstm-v2.vercel.app/)

Explore the code on GitHub: [github.com/affancoder/gigstm](https://github.com/affancoder/gigstm)

---

### 🎯 Vision for the Future

Under Affan's leadership, GigsTM aims to:
- Expand to global markets
- Implement AI-powered job matching
- Enhance mobile experience
- Build a thriving community of professionals

*"The only way to do great work is to love what you do."* - Steve Jobs

---

<div align="center">
  Made with ❤️ by Developer Affan | © 2025 GigsTM. All rights reserved.
</div>
