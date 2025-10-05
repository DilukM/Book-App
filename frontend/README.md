# 📚 BookHub Frontend - Book Management System# BookHub - Book Management SystemThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

A modern, responsive book management application built with Next.js 15, featuring a beautiful UI with Material-UI and a seamless user experience.A comprehensive book management system built with Next.js, Material-UI, and vanilla CSS.## Getting Started

## 🌐 Live Demo## 🚀 Quick StartFirst, run the development server:

**Frontend Application**: [https://book-app-front-wine.vercel.app/](https://book-app-front-wine.vercel.app/)`bash`bash

**Backend API**: [https://book-app-back-gamma.vercel.app/graphql](https://book-app-back-gamma.vercel.app/graphql)npm installnpm run dev

## ✨ Featuresnpm run dev# or

### 📖 Book Management`````yarn dev

- **Browse Books**: View all books in a beautifully designed card layout

- **Book Details**: Detailed view of each book with all information# or

- **Add Books**: Create new book entries with title, author, genre, year, ISBN, and description

- **Edit Books**: Update existing book informationOpen [http://localhost:3000](http://localhost:3000)pnpm dev

- **Delete Books**: Remove books from your collection

- **Search**: Real-time search functionality to find books by title, author, or genre# or

- **Pagination**: Efficient browsing with paginated results

## Demo Credentialsbun dev

### 🔐 Authentication & Authorization

- **User Registration**: Create new accounts with secure authentication- Username: `admin` | Password: `admin123````

- **User Login**: JWT-based authentication system

- **Protected Routes**: Automatic redirection for unauthenticated users- Username: `user` | Password: `user123`

- **Persistent Sessions**: Stay logged in across browser sessions

- **User Context**: Global authentication state managementOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 🎨 User Interface## Features

- **Responsive Design**: Seamlessly works on mobile, tablet, and desktop devices

- **Modern UI**: Clean and intuitive interface with Material-UI components- User Authentication (Login/Register)You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- **Custom Styling**: Vanilla CSS modules for precise control

- **Loading States**: Smooth loading indicators for better UX- CRUD Operations for Books

- **Error Handling**: User-friendly error messages and alerts

- **Theme System**: Consistent color palette and typography- Search & Filter FunctionalityThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### 🔄 State Management- Pagination

- **Context API**: Efficient global state management

- **Auth Context**: Centralized authentication state- Fully Responsive Design (Mobile, Tablet, Desktop)## Learn More

- **Book Context**: Centralized book data management

- **Apollo Client**: GraphQL client integration for API communication- Custom Color Palette & Theme

## 🚀 Technologies Used- Local Storage (Ready for GraphQL)To learn more about Next.js, take a look at the following resources:

### Core Framework

- **Next.js 15** - React framework with App Router and Turbopack

- **React 19** - Latest React with concurrent features## Tech Stack- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- **TypeScript** - Type-safe JavaScript for better development experience

- Next.js 15 with App Router- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

### UI & Styling

- **Material-UI (MUI) v7** - Modern React component library- TypeScript

- **Emotion** - CSS-in-JS styling solution

- **CSS Modules** - Scoped styling for components- Material-UIYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

- **Custom Theme** - Consistent design system

- Vanilla CSS with CSS Modules

### Data & State Management

- **Apollo Client v4** - GraphQL client for API communication- Context API for State Management## Deploy on Vercel

- **Context API** - React's built-in state management

- **GraphQL** - Query language for efficient data fetching

### Development Tools## Project StructureThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

- **Turbopack** - Fast bundler for development

- **ESLint** - Code linting and quality enforcement`````

- **TypeScript Compiler** - Static type checking

src/Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🛠️ Developer Setup Guide

├── app/ # Next.js pages

### Prerequisites├── components/ # Reusable components

- **Node.js** v18 or higher├── context/ # State management

- **npm** or **yarn** package manager├── data/ # JSON data

- **Git** for version control├── styles/ # Global styles & theme

└── types/ # TypeScript types

### 1. Clone the Repository

````

```bash

# Clone the main repository## Color Palette

git clone https://github.com/DilukM/Book-App.git- Primary: #2c3e50 (Dark Blue-Grey)

cd "Book App/frontend"- Secondary: #3498db (Bright Blue)

```- Success: #27ae60

- Error: #e74c3c

### 2. Install Dependencies

## Responsive Breakpoints

```bash- Mobile: 0-576px

# Using npm- Tablet: 577px-992px

npm install- Desktop: 993px+



# Or using yarn## Future: GraphQL Integration

yarn installThe app is structured to easily integrate GraphQL APIs. Update context files to replace localStorage with GraphQL queries/mutations.



# Or using pnpmCreated for educational purposes demonstrating Next.js, MUI, and modern web development best practices.

pnpm install```

````

### 3. Environment Configuration

Create a `.env.local` file in the frontend directory:

```env
# GraphQL API Endpoint
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:3001/graphql

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: For production deployment
# NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://book-app-back-gamma.vercel.app/graphql
```

**Note**: Copy from `example.env.local` and update with your values.

### 4. Start Development Server

```bash
# Start with Turbopack (recommended - faster)
npm run dev

# The application will be available at:
# http://localhost:3000
```

### 5. Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start

# Or build and start in one command
npm run build && npm start
```

## 📁 Project Structure

```
frontend/
├── public/                    # Static assets
│   ├── logo.png              # Application logo
│   └── *.svg                 # Icon files
│
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── layout.tsx        # Root layout with providers
│   │   ├── page.tsx          # Home page
│   │   ├── globals.css       # Global styles
│   │   ├── books/            # Books listing page
│   │   │   ├── page.tsx
│   │   │   ├── [id]/         # Book detail page (dynamic route)
│   │   │   │   ├── page.tsx
│   │   │   │   └── edit/     # Edit book page
│   │   │   └── add/          # Add new book page
│   │   ├── login/            # Login page
│   │   └── register/         # Registration page
│   │
│   ├── components/           # Reusable React components
│   │   ├── Header/           # Navigation header
│   │   ├── Footer/           # Page footer
│   │   ├── BookCard/         # Book display card
│   │   ├── BookForm/         # Book creation/edit form
│   │   ├── SearchBar/        # Search functionality
│   │   ├── Pagination/       # Pagination controls
│   │   ├── Loading/          # Loading spinner
│   │   ├── Alert/            # Alert messages
│   │   └── ProtectedRoute/   # Route protection HOC
│   │
│   ├── context/              # React Context providers
│   │   ├── AuthContext.tsx   # Authentication state
│   │   └── BookContext.tsx   # Book data state
│   │
│   ├── lib/                  # Utility libraries
│   │   ├── apollo.ts         # Apollo Client configuration
│   │   ├── auth.ts           # Authentication utilities
│   │   └── books.ts          # Book-related utilities
│   │
│   ├── styles/               # Global styling
│   │   ├── theme.css         # Theme variables
│   │   └── variables.css     # CSS custom properties
│   │
│   └── types/                # TypeScript type definitions
│       └── index.ts          # Shared type definitions
│
├── .env.local                # Environment variables (create this)
├── example.env.local         # Environment variables template
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
├── eslint.config.mjs         # ESLint configuration
└── package.json              # Dependencies and scripts
```

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--primary-color: #2c3e50; /* Dark Blue-Grey */
--secondary-color: #3498db; /* Bright Blue */

/* Status Colors */
--success-color: #27ae60; /* Green */
--error-color: #e74c3c; /* Red */
--warning-color: #f39c12; /* Orange */
--info-color: #3498db; /* Blue */

/* Neutral Colors */
--background: #f8f9fa; /* Light Grey */
--text-color: #2c3e50; /* Dark */
--border-color: #ddd; /* Light Grey */
```

### Responsive Breakpoints

- **Mobile**: 0-576px
- **Tablet**: 577px-992px
- **Desktop**: 993px+

### Typography

- **Font Family**: System fonts with fallback
- **Headings**: Bold, scaled sizes
- **Body**: Regular weight, comfortable line-height

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server with Turbopack

# Production
npm run build            # Create optimized production build
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint for code quality checks
```

## 🌐 Deployment to Vercel

### Automatic Deployment

1. **Push to GitHub**: Ensure your code is pushed to your GitHub repository
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `frontend`
3. **Configure Environment Variables**:
   - Add `NEXT_PUBLIC_GRAPHQL_ENDPOINT` with your backend URL
   - Add any other required environment variables
4. **Deploy**: Vercel will automatically build and deploy your app

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

## 🔌 GraphQL Integration

The app uses Apollo Client to communicate with the GraphQL backend:

### Example Queries

```graphql
# Get all books
query GetBooks {
  books {
    id
    title
    author
    genre
    publishedYear
  }
}

# Get single book
query GetBook($id: String!) {
  book(id: $id) {
    id
    title
    author
    genre
    publishedYear
    description
    isbn
  }
}
```

### Example Mutations

```graphql
# Create book
mutation CreateBook($input: CreateBookInput!) {
  createBook(input: $input) {
    id
    title
    author
  }
}

# Update book
mutation UpdateBook($id: String!, $input: UpdateBookInput!) {
  updateBook(id: $id, input: $input) {
    id
    title
  }
}
```

## 🧪 Testing

```bash
# Run tests (when configured)
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

