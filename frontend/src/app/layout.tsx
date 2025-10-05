"use client";

import "./globals.css";
import { ApolloProvider } from '@apollo/client/react';
import { client } from '@/lib/apollo';
import { AuthProvider } from "@/context/AuthContext";
import { BookProvider } from "@/context/BookContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider client={client}>
          <AuthProvider>
            <BookProvider>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100vh",
                }}
              >
                <Header />
                <main style={{ flex: 1 }}>{children}</main>
                <Footer />
              </div>
            </BookProvider>
          </AuthProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
