"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useBooks } from "@/context/BookContext";
import styles from "./page.module.css";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { books } = useBooks();

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Welcome to <span className={styles.highlight}>BookHub</span>
          </h1>
          <p className={styles.heroDescription}>
            Your personal book management system. Organize, discover, and track
            your reading journey all in one place.
          </p>

          {isAuthenticated ? (
            <div className={styles.heroActions}>
              <Link href="/books" className={styles.primaryButton}>
                Browse Books
              </Link>
              <Link href="/books/add" className={styles.secondaryButton}>
                Add New Book
              </Link>
            </div>
          ) : (
            <div className={styles.heroActions}>
              <Link href="/login" className={styles.primaryButton}>
                Get Started
              </Link>
              <Link href="/register" className={styles.secondaryButton}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.sectionTitle}>Features</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📚</div>
              <h3 className={styles.featureTitle}>Manage Books</h3>
              <p className={styles.featureDescription}>
                Add, edit, and organize your book collection with ease. Keep
                track of all your reading materials.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔍</div>
              <h3 className={styles.featureTitle}>Search & Filter</h3>
              <p className={styles.featureDescription}>
                Quickly find books by title, author, or genre. Advanced search
                makes discovery simple.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📱</div>
              <h3 className={styles.featureTitle}>Responsive Design</h3>
              <p className={styles.featureDescription}>
                Access your library from any device. Optimized for desktop,
                tablet, and mobile.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔐</div>
              <h3 className={styles.featureTitle}>Secure</h3>
              <p className={styles.featureDescription}>
                Your data is protected with secure authentication. Only you can
                access your collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {isAuthenticated && (
        <section className={styles.stats}>
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{books.length}</div>
              <div className={styles.statLabel}>Total Books</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>
                {new Set(books.map((b) => b.genre)).size}
              </div>
              <div className={styles.statLabel}>Genres</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>
                {new Set(books.map((b) => b.author)).size}
              </div>
              <div className={styles.statLabel}>Authors</div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
