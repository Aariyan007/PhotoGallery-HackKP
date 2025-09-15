# PhotoGallery - HackKP

A modern, feature-rich photo gallery application built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to manage and showcase their photos with a beautiful, responsive interface.

![PhotoGallery Preview](screenshots/preview.png) <!-- You can add screenshots later -->

## 🌟 Features

- **User Authentication**
  - Secure registration and login
  - JWT-based authentication with refresh tokens
  - Password strength validation
  - Protected routes

- **Photo Management**
  - Upload and organize photos
  - Create and manage albums
  - View photos in a responsive grid layout
  - Full-screen photo viewing

- **Modern UI/UX**
  - Responsive design for all devices
  - Dark mode support
  - Smooth animations and transitions
  - Interactive feedback
  - Loading states and error handling

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aariyan007/PhotoGallery-HackKP.git
   cd PhotoGallery-HackKP
   ```

2. **Set up the backend**
   ```bash
   cd Backend
   npm install
   ```

   Create a .env file in the Backend directory:
   ```env
   PORT=3001
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_token_secret
   JWT_EXPIRE=7d
   JWT_REFRESH_EXPIRE=30d
   ```

3. **Set up the frontend**
   ```bash
   cd ../FrontEnd/hackkp
   npm install
   ```

4. **Start the application**

   In the Backend directory:
   ```bash
   npm start
   ```

   In the FrontEnd/hackkp directory:
   ```bash
   npm run dev
   ```

   The application will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- TailwindCSS for styling
- Framer Motion for animations
- Lucide React for icons
- React Router for navigation

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Cookie-based token management

## 📁 Project Structure

```
PhotoGallery-HackKP/
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── index.js
│
└── FrontEnd/
    └── hackkp/
        ├── src/
        │   ├── components/
        │   ├── contexts/
        │   ├── layouts/
        │   ├── pages/
        │   ├── services/
        │   └── utils/
        └── vite.config.js
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token rotation
- HTTP-only cookies
- CORS protection
- Input validation
- XSS protection
- Rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Aariyan007**
- GitHub: [@Aariyan007](https://github.com/Aariyan007)

## 🙏 Acknowledgments

- Thanks to the HackKP team and organizers
- All contributors and supporters of the project
- The MERN stack community

---

⭐️ If you found this project helpful, please give it a star!