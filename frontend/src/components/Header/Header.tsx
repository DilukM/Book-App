"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
<Image
            src="/logo.png"
            alt="BookHub Logo"
            width={32}
            height={32}
            className={styles.logoImage}
          />
          BookHub
        </Link>

        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        <nav
          className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ""}`}
        >
          <Link
            href="/"
            className={`${styles.navLink} ${
              isActive("/") ? styles.navLinkActive : ""
            }`}
            onClick={closeMobileMenu}
          >
            Home
          </Link>

          {isAuthenticated && (
            <>
              <Link
                href="/books"
                className={`${styles.navLink} ${
                  isActive("/books") ? styles.navLinkActive : ""
                }`}
                onClick={closeMobileMenu}
              >
                Books
              </Link>
              <Link
                href="/books/add"
                className={`${styles.navLink} ${
                  isActive("/books/add") ? styles.navLinkActive : ""
                }`}
                onClick={closeMobileMenu}
              >
                Add Book
              </Link>
            </>
          )}

          <div className={styles.authSection}>
            {isAuthenticated ? (
              <>
                <span className={styles.username}>👤 {user?.name}</span>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={styles.loginLink}
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={styles.registerButton}
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
