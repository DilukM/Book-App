# BookHub - Book Management SystemThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

A comprehensive book management system built with Next.js, Material-UI, and vanilla CSS.## Getting Started

## 🚀 Quick StartFirst, run the development server:

`bash`bash

npm installnpm run dev

npm run dev# or

`````yarn dev

# or

Open [http://localhost:3000](http://localhost:3000)pnpm dev

# or

## Demo Credentialsbun dev

- Username: `admin` | Password: `admin123````

- Username: `user` | Password: `user123`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- User Authentication (Login/Register)You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- CRUD Operations for Books

- Search & Filter FunctionalityThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

- Pagination

- Fully Responsive Design (Mobile, Tablet, Desktop)## Learn More

- Custom Color Palette & Theme

- Local Storage (Ready for GraphQL)To learn more about Next.js, take a look at the following resources:



## Tech Stack- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- Next.js 15 with App Router- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

- TypeScript

- Material-UIYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

- Vanilla CSS with CSS Modules

- Context API for State Management## Deploy on Vercel



## Project StructureThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

`````

src/Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

├── app/ # Next.js pages
├── components/ # Reusable components
├── context/ # State management
├── data/ # JSON data
├── styles/ # Global styles & theme
└── types/ # TypeScript types

```

## Color Palette
- Primary: #2c3e50 (Dark Blue-Grey)
- Secondary: #3498db (Bright Blue)
- Success: #27ae60
- Error: #e74c3c

## Responsive Breakpoints
- Mobile: 0-576px
- Tablet: 577px-992px
- Desktop: 993px+

## Future: GraphQL Integration
The app is structured to easily integrate GraphQL APIs. Update context files to replace localStorage with GraphQL queries/mutations.

Created for educational purposes demonstrating Next.js, MUI, and modern web development best practices.
```
