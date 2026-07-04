# NEXUS Auth — Premium MERN Authentication System

NEXUS Auth is a production-ready, highly secure, and visually stunning full-stack authentication system built using the MERN stack (MongoDB, Express.js, React, Node.js). It is designed with a premium, modern "glassmorphism" aesthetic, smooth GSAP animations, and robust security practices.

![NEXUS Auth Preview](https://via.placeholder.com/1200x600.png?text=NEXUS+Auth+-+Premium+Security+Design)

## ✨ Features

- **End-to-End Authentication:** Secure user registration, login, and logout.
- **Email Verification (OTP):** True cryptographically secure 6-digit OTP codes sent via email using Nodemailer.
- **Password Reset Flow:** Forgot password and secure password reset using time-sensitive OTPs.
- **JWT Authorization:** Secure HTTP-only cookie-based JWT authentication to protect routes.
- **Premium UI/UX:** Stunning glassmorphism design with a dynamic ambient background, interactive hover states, and fully responsive layouts.
- **GSAP Animations:** Fluid entrance animations, stagger effects, and smooth transitions.
- **Dynamic Dashboard:** A protected user dashboard displaying live account statistics, verification status, and user data.
- **Robust Error Handling:** Comprehensive `try/catch` wrappers and graceful fallback UI with interactive toast notifications.

## 🛠️ Technology Stack

### Frontend
- **React.js** (Vite)
- **React Router DOM** (Client-side routing)
- **GSAP** (High-performance animations)
- **Vanilla CSS** (Custom design system, glassmorphism, responsive grid)

### Backend
- **Node.js & Express.js** (v4.21.x)
- **MongoDB** (Mongoose ODM)
- **JSON Web Tokens (JWT)** (Stateless authentication)
- **Bcrypt.js** (Password hashing)
- **Nodemailer** (SMTP email delivery)
- **Crypto** (Node.js built-in cryptographically secure OTP generation)

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

- Node.js installed (v16+)
- MongoDB Atlas account (or local MongoDB server)
- An SMTP provider account (e.g., Brevo, SendGrid, Mailtrap) for sending emails.

### 1. Clone the repository

```bash
git clone https://github.com/Muhammad-Shoaib-Arshad/Auth_Project.git
cd Auth_Project
```

### 2. Backend Setup

Open a terminal and navigate to the `server` directory:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add the following variables:

```env
# MongoDB Connection String
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/mern-auth

# JWT Secret Key
JWT_SECRET=your_super_secret_jwt_key

# Frontend URL (For CORS & Emails)
CLIENT_URL=http://localhost:3000

# Server Port
PORT=5000

# SMTP Configuration (For sending OTPs)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_email@example.com
SMTP_PASS=your_smtp_password
SENDER_EMAIL=your_verified_sender_email@example.com
```

Start the backend development server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a **separate** terminal and navigate to the `client` directory:

```bash
cd client
npm install
```

Start the frontend development server:

```bash
npm run dev
```

### 4. Running the App

Once both servers are running:
1. Open your browser and navigate to `http://localhost:3000`.
2. The Vite dev server proxies API requests automatically to `http://localhost:5000`.
3. Try creating a new account to test the email verification flow!

## 📂 Project Structure

```text
📦 Auth_Project
 ┣ 📂 client                 # React Frontend
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components         # Reusable UI components (AuthShell, Toast)
 ┃ ┃ ┣ 📂 pages              # Main views (Login, Register, Dashboard, etc.)
 ┃ ┃ ┣ 📜 api.js             # API helper functions using fetch
 ┃ ┃ ┣ 📜 App.jsx            # Main application router
 ┃ ┃ ┣ 📜 main.jsx           # React entry point
 ┃ ┃ ┗ 📜 styles.css         # Global stylesheet & design tokens
 ┃ ┗ 📜 vite.config.js       # Vite configuration & proxy settings
 ┣ 📂 server                 # Node.js Backend
 ┃ ┣ 📂 config               # Database and Nodemailer configs
 ┃ ┣ 📂 Controllers          # Business logic for auth routes
 ┃ ┣ 📂 middleware           # JWT protection middleware
 ┃ ┣ 📂 models               # Mongoose database schemas
 ┃ ┣ 📂 routes               # Express API routes
 ┃ ┗ 📜 server.js            # Express application entry point
 ┗ 📜 .gitignore
```

## 🔒 Security Best Practices Implemented

- **No OTP Leaks:** OTPs are never exposed in API responses (even in development mode). They are strictly sent via email.
- **Secure Randomness:** Replaced `Math.random()` with Node's `crypto.randomInt()` to prevent predictable token generation.
- **HttpOnly Cookies:** JWTs are stored in secure, `HttpOnly` cookies to protect against XSS (Cross-Site Scripting) attacks.
- **Password Hashing:** Passwords are hashed with `bcrypt.js` using a salt round of 10 before saving to the database.
- **CORS Protection:** Configured strict CORS policies to only allow traffic from verified client origins.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
