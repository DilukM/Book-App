# 📚 BookHub - Personal Book Management System

A modern, full-stack book management application that allows users to organize, discover, and track their reading journey. Built with cutting-edge technologies for optimal performance and user experience.

## 🌐 Live Demo

- **Frontend (Vercel)**: [https://book-app-front-wine.vercel.app/](https://book-app-front-wine.vercel.app/)
- **Backend API (Vercel)**: [https://book-app-back-gamma.vercel.app/graphql](https://book-app-back-gamma.vercel.app/graphql)

## 🚀 Technologies Used

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React version
- **TypeScript** - Type-safe JavaScript
- **Apollo Client** - GraphQL client for data fetching
- **Material-UI (MUI)** - Modern React component library
- **Emotion** - CSS-in-JS styling
- **Turbopack** - Fast bundler for development

### Backend

- **NestJS** - Progressive Node.js framework
- **GraphQL** - Query language and runtime
- **Apollo Server** - GraphQL server implementation
- **TypeScript** - Type-safe JavaScript
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Express** - Web application framework

### Development & Deployment

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Vercel** - Deployment platform

## ✨ Features

### 📖 Book Management

- **CRUD Operations**: Create, read, update, and delete books
- **Book Details**: Title, author, published year, genre, description, ISBN
- **Search & Filter**: Find books by title, author, or genre
- **Pagination**: Efficient browsing of large book collections

### 🔐 Authentication & Authorization

- **User Registration**: Create new user accounts
- **Secure Login**: JWT-based authentication
- **Protected Routes**: Access control for authenticated users
- **User Context**: Global authentication state management

### 🎨 User Interface

- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern UI**: Clean, intuitive interface with Material-UI
- **Loading States**: Smooth user experience with loading indicators
- **Error Handling**: Comprehensive error messages and alerts
- **Search Bar**: Real-time search functionality

### 🏗️ Architecture

- **GraphQL API**: Efficient data fetching with single endpoint
- **Component-Based**: Reusable React components
- **Context Management**: Global state management for auth and books
- **Type Safety**: Full TypeScript implementation
- **Modular Structure**: Organized codebase with clear separation of concerns

## 🛠️ Developer Setup Guide

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### 1. Clone the Repository

```bash
git clone https://github.com/DilukM/Book-App.git
cd "Book App"
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Environment Configuration

Create a `.env` file in the backend directory:

```env
# Copy from example.env and update values
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
PORT=3000
```

#### Start Backend Development Server

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The GraphQL playground will be available at: `http://localhost:3001/graphql`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd ../frontend
npm install
```

#### Environment Configuration

Create a `.env.local` file in the frontend directory:

```env
# Copy from example.env.local and update values
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:3001/graphql
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Start Frontend Development Server

```bash
# Development mode with Turbopack
npm run dev

# Build for production
npm run build
npm run start
```

The application will be available at: `http://localhost:3000`

### 4. Development Workflow

#### Running Tests

```bash
# Backend tests
cd backend
npm run test
npm run test:e2e

# Frontend tests (if configured)
cd frontend
npm run test
```

#### Code Quality

```bash
# Linting
npm run lint

# Formatting (backend)
npm run format
```

## 📁 Project Structure

```
Book App/
├── backend/                 # NestJS GraphQL API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/       # Authentication module
│   │   │   └── books/      # Books module
│   │   ├── app.module.ts   # Root module
│   │   └── main.ts         # Application entry point
│   ├── api/                # Vercel serverless functions
│   └── vercel.json         # Vercel deployment config
│
├── frontend/               # Next.js React application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── lib/          # Utility libraries
│   │   └── types/        # TypeScript type definitions
│   └── public/           # Static assets
│
└── README.md             # This file
```

## 🚀 Deployment

### Backend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set the root directory to `backend`
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend`
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

## 📝 API Documentation

The GraphQL API provides the following operations:

### Queries

- `books`: Get all books with pagination
- `book(id: String!)`: Get a specific book by ID
- `searchBooks(query: String!)`: Search books by title, author, or genre
- `me`: Get current user information

### Mutations

- `login(email: String!, password: String!)`: User authentication
- `register(input: RegisterInput!)`: User registration
- `createBook(input: CreateBookInput!)`: Add a new book
- `updateBook(id: String!, input: UpdateBookInput!)`: Update existing book
- `deleteBook(id: String!)`: Remove a book
