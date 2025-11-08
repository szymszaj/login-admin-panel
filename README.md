# Login & Admin Panel

A simple authentication system with login, registration, and password reset. Built to learn full-stack development with Next.js and Supabase.

I wanted to practice building a complete auth flow from scratch – user registration, email verification, login sessions, and password reset.

## 🛠️ What I used

- **Next.js 15** – React framework with App Router
- **TypeScript** – For type safety
- **Tailwind CSS + shadcn/ui** – Styling and components
- **Supabase** – Database and authentication backend
- **React Hook Form + Zod** – Form handling and validation

## ⚙️ How it works

1. **Registration** – User signs up, Supabase sends verification email
2. **Email verification** – User clicks link, account gets activated
3. **Login** – User logs in, session is created
4. **Protected routes** – Middleware blocks unauthorized access to dashboard
5. **Password reset** – User requests reset, gets email with secure link

All user data and sessions are stored in Supabase. Passwords are automatically hashed and secure.

## 🚀 Features

- ✅ User registration with email verification
- ✅ Login with session management
- ✅ Password reset via email
- ✅ Protected dashboard (requires login)
- ✅ Custom dark-themed email templates
- 🔒 Middleware protection on routes

## 📦 Setup

```bash
git clone https://github.com/szymszaj/login-admin-panel.git
cd login-admin-panel
npm install

NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

npm run dev
```
