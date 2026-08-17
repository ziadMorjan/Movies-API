# 🎬 CimaFlix RESTful API & AI Backend

A robust, enterprise-grade **Node.js / Express / MongoDB** backend for the **CimaFlix** streaming and content discovery platform. Built with clean architecture, strict security standards, real-time notification engine, and **Google Gemini AI** integration for smart cinematic recommendations and chat.

---

## 🌟 Core Highlights

- 🔐 **Comprehensive Authentication & Authorization**
  - JWT-based authentication (HttpOnly Cookies & Authorization Headers).
  - OAuth 2.0 integration with **Google** and **Facebook**.
  - Role-Based Access Control (**User**, **Admin**).
  - Secure password hashing with `bcryptjs` and email verification / password reset workflows.
- 🤖 **Gemini AI Movie Assistant & Smart Recommendations**
  - Integrated with `@google/generative-ai` (Gemini 2.5 Flash / 1.5 Flash).
  - Context-aware movie recommendations, plot insights, and cinematic chat endpoint (`/api/v1/movies/ai-chat`).
- 🔔 **Notification Synchronization Engine**
  - Automatic broadcast notifications triggered upon new movie/series releases.
  - Per-user notification state tracking (`lastReadNotifications`).
- 🎥 **Full Media Catalog & CRUD Management**
  - Complete REST APIs for Movies, Series, Seasons, Episodes, Actors, and Genres.
  - Advanced filtering, sorting, pagination, and regex text search.
- 📊 **Platform Analytics & Statistics**
  - Aggregated metrics for total users, movies, series, watch trends, and genre distributions.
- 🛡️ **Production-Ready Security & Performance**
  - Request rate limiting (`express-rate-limit`).
  - Data sanitization against NoSQL injection (`express-mongo-sanitize`) and XSS (`xss-clean`).
  - Parameter pollution protection (`hpp`) & secure HTTP headers (`helmet`).
  - Robust centralized error handling with custom `CustomError` and environment-aware logging.
- ☁️ **Cloudinary Media Pipeline**
  - Direct and optimized poster/backdrop image upload management via `multer` + `multer-storage-cloudinary` + `sharp`.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Runtime & Framework** | Node.js (v18+ / v22+), Express.js (ES Modules) |
| **Database & ODM** | MongoDB, Mongoose |
| **Artificial Intelligence** | Google Generative AI SDK (`@google/generative-ai`), Gemini Flash models |
| **Security & Middleware** | Helmet, CORS, Express-Rate-Limit, Express-Mongo-Sanitize, XSS-Clean, HPP |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), Google Auth Library, Bcryptjs |
| **Media & File Storage** | Cloudinary, Multer, Sharp |
| **Mailing Service** | Mailtrap SDK |
| **Code Quality & Utilities** | Morgan, Validator, Dotenv |

---

## 📁 Project Architecture

```
Movies-API/
├── config/                  # Database and 3rd-party configurations
│   ├── cloudinaryConfig.js
│   └── db.js                # Resilient MongoDB connection handler
├── controllers/             # Business logic & request handling
│   ├── authController.js
│   ├── moviesController.js  # Includes AI Chat & recommendations
│   ├── seriesController.js
│   ├── notificationController.js
│   ├── userController.js
│   ├── statsController.js
│   └── ...
├── middlewares/             # Security, auth, and error handling
│   ├── authMiddleware.js    # protect, restrictTo, optionalProtect
│   ├── errorMiddleware.js   # Global centralized error handler
│   ├── uploadMiddleware.js  # Multer & Cloudinary image handlers
│   └── validatorMiddleware.js
├── models/                  # Mongoose schemas & data models
│   ├── movieModel.js
│   ├── seriesModel.js
│   ├── userModel.js
│   ├── notificationModel.js
│   └── ...
├── routes/                  # Modular API route definitions
│   ├── authRouts.js
│   ├── moviesRoutes.js
│   ├── seriesRoutes.js
│   ├── notificationRoutes.js
│   ├── usersRoutes.js
│   └── statsRoutes.js
├── utils/                   # Helper functions, logger, error classes
│   ├── CustomError.js
│   ├── logger.js
│   └── ...
├── app.js                   # Express application setup & middleware stack
├── server.js                # Server entry point & graceful shutdown
├── package.json
└── README.md
```

---

## 📡 API Endpoints Overview

### 🔐 Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user account | Public |
| `POST` | `/login` | Authenticate user & issue JWT | Public |
| `GET` | `/logout` | Clear auth cookies & terminate session | Public |
| `POST` | `/google-login` | Authenticate with Google ID token | Public |
| `POST` | `/facebook-login` | Authenticate with Facebook OAuth | Public |
| `POST` | `/forgotPassword` | Send password reset token to email | Public |
| `PATCH`| `/resetPassword/:token` | Set new password with valid token | Public |

### 🎬 Movies & AI (`/api/v1/movies`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get paginated movies with filtering & sorting | Public |
| `GET` | `/:id` | Get movie details by ID (auto increments view count) | Public |
| `POST` | `/` | Create a new movie (with image upload) | Admin |
| `PATCH`| `/:id` | Update movie details | Admin |
| `DELETE`| `/:id` | Delete a movie | Admin |
| `POST` | `/ai-chat` | **AI Chat & Smart Movie Recommendation Assistant** | Public / Optional User |

### 📺 Series & Episodes (`/api/v1/series`, `/api/v1/episodes`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/series` | List all series with filters | Public |
| `GET` | `/api/v1/series/:id` | Get series details with seasons & episodes | Public |
| `POST` | `/api/v1/series` | Create a new series | Admin |
| `POST` | `/api/v1/episodes` | Add an episode to a season | Admin |

### 🔔 Notifications (`/api/v1/notifications`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Retrieve latest system release notifications | Public / User |
| `PATCH`| `/mark-read` | Sync and update user's read timestamp | Private |

### 👤 Users & Stats (`/api/v1/users`, `/api/v1/stats`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users/me` | Get current logged-in user profile | Private |
| `PATCH`| `/api/v1/users/updateMe` | Update profile information | Private |
| `GET` | `/api/v1/stats` | Retrieve platform summary & metrics | Admin |

---

## ⚙️ Environment Variables

Create a `config.env` file in the root directory (or configure them in your cloud hosting provider like Render / Railway / AWS):

```env
# Server
NODE_ENV=production
PORT=8000
HOST_NAME=0.0.0.0

# Database
CON_STR=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<databaseName>?retryWrites=true&w=majority

# Security & JWT
JWT_SECRET_KEY=your_super_secret_jwt_key_at_least_32_characters
LOGIN_EXPIRE=7d

# Frontend CORS URL
CLIENT_URL=https://your-movies-frontend.vercel.app

# Google Gemini AI Integration
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# OAuth Credentials
GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Mail Service (Mailtrap)
MAILTRAP_API_KEY=your_mailtrap_api_key
MAILTRAP_USE_SANDBOX=true
MAILTRAP_INBOX_ID=your_inbox_id
MAIL_FROM=CimaFlix <no-reply@cimaflix.com>
```

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/ziadMorjan/Movies-API.git
cd Movies-API
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create `config.env` based on the configuration above.

### 4. Run development server
```bash
npm run dev
```

### 5. Run in production mode
```bash
npm run start
```

---

## 🛡️ License

This project is licensed under the **ISC License**. Developed with ❤️ as part of the CimaFlix full-stack platform.
