# 🔧 BookHub Backend - GraphQL API<p align="center">

<a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>

A robust, scalable GraphQL API built with NestJS for the BookHub book management system. Features JWT authentication, modular architecture, and efficient data handling.</p>

## 🌐 Live Demo[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

**Backend API (GraphQL Playground)**: [https://book-app-back-gamma.vercel.app/graphql](https://book-app-back-gamma.vercel.app/graphql)

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

**Frontend Application**: [https://book-app-front-wine.vercel.app/](https://book-app-front-wine.vercel.app/) <p align="center">

<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>

## ✨ Features<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>

<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>

### 📚 Book Management API<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>

- **CRUD Operations**: Full Create, Read, Update, Delete functionality for books<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>

- **Book Search**: Search books by title, author, or genre<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>

- **Data Validation**: Input validation using class-validator<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>

- **Type Safety**: Full TypeScript implementation with GraphQL schemas <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>

- **In-Memory Storage**: Efficient data storage (ready for database integration) <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>

- **UUID Generation**: Unique identifiers for all resources <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>

</p>

### 🔐 Authentication & Security <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)

- **JWT Authentication**: Secure token-based authentication [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

- **Password Hashing**: bcryptjs for secure password storage

- **Protected Resolvers**: Guard-protected GraphQL resolvers## Description

- **User Registration**: Secure user account creation

- **User Login**: Token generation on successful authentication[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

- **Token Validation**: Middleware for request authentication

## Project setup

### 🎯 GraphQL API

- **GraphQL Queries**: Efficient data fetching```bash

- **GraphQL Mutations**: Data modification operations$ npm install

- **GraphQL Playground**: Interactive API documentation```

- **Type Definitions**: Strong typing with @nestjs/graphql

- **Schema-First Approach**: Auto-generated GraphQL schema## Compile and run the project

- **Apollo Server Integration**: Industry-standard GraphQL server

````bash

### 🏗️ Architecture# development

- **Modular Design**: Separated concerns with NestJS modules$ npm run start

- **Dependency Injection**: Clean, testable code architecture

- **Service Layer**: Business logic separation# watch mode

- **Resolver Layer**: GraphQL endpoint handlers$ npm run start:dev

- **Entity Layer**: Data model definitions

- **Type Safety**: End-to-end TypeScript types# production mode

$ npm run start:prod

## 🚀 Technologies Used```



### Core Framework## Run tests

- **NestJS 11** - Progressive Node.js framework

- **Node.js** - JavaScript runtime environment```bash

- **TypeScript 5** - Type-safe JavaScript superset# unit tests

- **Express 5** - Web application framework$ npm run test



### GraphQL Stack# e2e tests

- **Apollo Server 5** - GraphQL server implementation$ npm run test:e2e

- **@nestjs/graphql** - NestJS GraphQL module

- **GraphQL** - Query language and runtime# test coverage

- **type-graphql** - TypeScript decorators for GraphQL$ npm run test:cov

````

### Authentication & Security

- **JWT (jsonwebtoken)** - Token-based authentication## Deployment

- **@nestjs/jwt** - NestJS JWT integration

- **bcryptjs** - Password hashing libraryWhen you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

- **class-validator** - Validation decorators

- **class-transformer** - Object transformationIf you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

### Development Tools```bash

- **Jest** - Testing framework$ npm install -g @nestjs/mau

- **Prettier** - Code formatting$ mau deploy

- **ESLint** - Code linting```

- **ts-node** - TypeScript execution

- **Nest CLI** - NestJS command-line interfaceWith Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

### Deployment## Resources

- **Vercel** - Serverless deployment platform

- **@vercel/node** - Vercel Node.js runtimeCheck out a few resources that may come in handy when working with NestJS:

## 🛠️ Developer Setup Guide- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.

- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).

### Prerequisites- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).

- **Node.js** v18 or higher- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.

- **npm** or **yarn** package manager- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).

- **Git** for version control- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).

- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).

### 1. Clone the Repository- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

````bash## Support

# Clone the main repository

git clone https://github.com/DilukM/Book-App.gitNest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

cd "Book App/backend"

```## Stay in touch



### 2. Install Dependencies- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)

- Website - [https://nestjs.com](https://nestjs.com/)

```bash- Twitter - [@nestframework](https://twitter.com/nestframework)

# Using npm

npm install## License



# Or using yarnNest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

yarn install

# Or using pnpm
pnpm install
````

### 3. Environment Configuration

Create a `.env` file in the backend directory:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Application Configuration
NODE_ENV=development
PORT=3001

# Optional: Database Configuration (for future integration)
# DATABASE_URL=postgresql://user:password@localhost:5432/bookdb
```

**Important**:

- Never commit your `.env` file to version control
- Use a strong, unique JWT_SECRET in production
- Copy from `example.env` and update with your values

### 4. Start Development Server

```bash
# Development mode with hot reload (recommended)
npm run start:dev

# Regular development mode
npm run start

# Debug mode
npm run start:debug

# The API will be available at:
# http://localhost:3001
# GraphQL Playground: http://localhost:3001/graphql
```

### 5. Build for Production

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

## 📁 Project Structure

```
backend/
├── api/                       # Vercel serverless functions
│   └── index.ts              # Vercel entry point
│
├── src/
│   ├── modules/              # Feature modules
│   │   ├── auth/             # Authentication module
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.resolver.ts     # GraphQL resolvers
│   │   │   ├── auth.service.ts      # Business logic
│   │   │   ├── auth.types.ts        # GraphQL types
│   │   │   └── user.entity.ts       # User entity
│   │   │
│   │   └── books/            # Books module
│   │       ├── book.module.ts
│   │       ├── book.resolver.ts     # GraphQL resolvers
│   │       ├── book.service.ts      # Business logic
│   │       ├── book.types.ts        # GraphQL types
│   │       └── book.entity.ts       # Book entity
│   │
│   ├── app.module.ts         # Root application module
│   ├── app.controller.ts     # REST endpoints (if any)
│   ├── app.service.ts        # Root service
│   └── main.ts               # Application entry point
│
├── test/                     # E2E tests
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── .env                      # Environment variables (create this)
├── example.env               # Environment template
├── vercel.json               # Vercel deployment config
├── nest-cli.json             # NestJS CLI configuration
├── tsconfig.json             # TypeScript configuration
├── tsconfig.build.json       # Build TypeScript config
├── eslint.config.mjs         # ESLint configuration
└── package.json              # Dependencies and scripts
```

## 🔌 GraphQL API Documentation

### Queries

#### Get All Books

```graphql
query GetBooks {
  books {
    id
    title
    author
    publishedYear
    genre
    description
    isbn
  }
}
```

#### Get Single Book

```graphql
query GetBook($id: String!) {
  book(id: $id) {
    id
    title
    author
    publishedYear
    genre
    description
    isbn
  }
}
```

#### Search Books

```graphql
query SearchBooks($query: String!) {
  searchBooks(query: $query) {
    id
    title
    author
    genre
  }
}
```

#### Get Current User

```graphql
query GetMe {
  me {
    id
    email
    username
  }
}
```

### Mutations

#### User Registration

```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    user {
      id
      email
      username
    }
    token
  }
}
```

**Variables:**

```json
{
  "input": {
    "email": "user@example.com",
    "username": "johndoe",
    "password": "securepassword123"
  }
}
```

#### User Login

```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      id
      email
      username
    }
    token
  }
}
```

**Variables:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Create Book

```graphql
mutation CreateBook($input: CreateBookInput!) {
  createBook(input: $input) {
    id
    title
    author
    publishedYear
    genre
  }
}
```

**Variables:**

```json
{
  "input": {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "publishedYear": 1925,
    "genre": "Fiction",
    "description": "A classic American novel",
    "isbn": "978-0-7432-7356-5"
  }
}
```

#### Update Book

```graphql
mutation UpdateBook($id: String!, $input: UpdateBookInput!) {
  updateBook(id: $id, input: $input) {
    id
    title
    author
    publishedYear
  }
}
```

**Variables:**

```json
{
  "id": "book-uuid-here",
  "input": {
    "title": "Updated Title",
    "author": "Updated Author"
  }
}
```

#### Delete Book

```graphql
mutation DeleteBook($id: String!) {
  deleteBook(id: $id)
}
```

**Variables:**

```json
{
  "id": "book-uuid-here"
}
```

### Authentication Headers

For protected endpoints, include JWT token in headers:

```json
{
  "Authorization": "Bearer your-jwt-token-here"
}
```

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov
```

### E2E Tests

```bash
# Run end-to-end tests
npm run test:e2e
```

### Test Structure

```typescript
// Example test file
describe('BookService', () => {
  let service: BookService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BookService],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('should create a book', () => {
    const book = service.create({
      title: 'Test Book',
      author: 'Test Author',
      // ...
    });
    expect(book).toBeDefined();
  });
});
```

## 🔧 Available Scripts

```bash
# Development
npm run start              # Start application
npm run start:dev          # Start with hot reload
npm run start:debug        # Start in debug mode

# Production
npm run build              # Build for production
npm run start:prod         # Start production server

# Code Quality
npm run format             # Format code with Prettier
npm run lint               # Lint code with ESLint

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Generate coverage report
npm run test:e2e           # Run E2E tests
```

## 🌐 Deployment to Vercel

### Automatic Deployment

1. **Push to GitHub**: Ensure your code is pushed to GitHub repository
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `backend`
3. **Configure Environment Variables**:
   - Add `JWT_SECRET` with a strong secret key
   - Add `NODE_ENV=production`
   - Add any other required variables
4. **Deploy**: Vercel will automatically build and deploy

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

### Vercel Configuration

The `vercel.json` file configures serverless deployment:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.ts"
    }
  ]
}
```

## 📝 Best Practices

### Code Organization

- Follow NestJS module-based architecture
- Use dependency injection for loose coupling
- Keep services focused and single-responsibility
- Write unit tests for all services
- Use DTOs for data validation

### Security

- Always hash passwords before storage
- Use environment variables for secrets
- Implement rate limiting for production
- Validate all user inputs
- Use HTTPS in production
- Keep dependencies updated

### Performance

- Implement caching where appropriate
- Use database indexes (when DB is integrated)
- Optimize GraphQL queries
- Monitor API response times
- Use connection pooling for databases


