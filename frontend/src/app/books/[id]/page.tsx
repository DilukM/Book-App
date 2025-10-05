'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useBooks } from '@/context/BookContext';
import Loading from '@/components/Loading/Loading';
import styles from './book-detail.module.css';

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;
  
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { getBookById, deleteBook } = useBooks();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const book = getBookById(bookId);

  if (!book) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h1 className={styles.errorTitle}>📚 Book Not Found</h1>
          <p className={styles.errorText}>
            The book you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      const result = await deleteBook(bookId);
      if (result.success) {
        router.push('/books');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{book.title}</h1>
          <p className={styles.author}>by {book.author}</p>
        </div>

        <div className={styles.content}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Published Year</div>
              <div className={styles.infoValue}>{book.publishedYear}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Genre</div>
              <div className={styles.infoValue}>{book.genre}</div>
            </div>
            {book.isbn && (
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>ISBN</div>
                <div className={styles.infoValue}>{book.isbn}</div>
              </div>
            )}
          </div>

          {book.description && (
            <div className={styles.description}>
              <h2 className={styles.descriptionTitle}>Description</h2>
              <p className={styles.descriptionText}>{book.description}</p>
            </div>
          )}

          <div className={styles.actions}>
            <Link href={`/books/${bookId}/edit`} className={styles.editButton}>
              Edit Book
            </Link>
            <button onClick={handleDelete} className={styles.deleteButton}>
              Delete Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
