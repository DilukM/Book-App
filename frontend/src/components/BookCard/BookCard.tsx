"use client";

import React from "react";
import Link from "next/link";
import { Book } from "@/types";
import styles from "./BookCard.module.css";

interface BookCardProps {
  book: Book;
  onDelete?: (id: string) => void;
}

export default function BookCard({ book, onDelete }: BookCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      onDelete &&
      confirm(`Are you sure you want to delete "${book.title}"?`)
    ) {
      onDelete(book.id);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{book.title}</h3>
        <span className={styles.year}>{book.publishedYear}</span>
      </div>

      <div className={styles.body}>
        <p className={styles.author}>
          <span className={styles.label}>Author:</span> {book.author}
        </p>
        <p className={styles.genre}>
          <span className={styles.badge}>{book.genre}</span>
        </p>
        {book.description && (
          <p className={styles.description}>
            {book.description.length > 120
              ? `${book.description.substring(0, 120)}...`
              : book.description}
          </p>
        )}
      </div>

      <div className={styles.footer}>
        <Link href={`/books/${book.id}`} className={styles.viewButton}>
          View Details
        </Link>
        <div className={styles.actions}>
          <Link href={`/books/${book.id}/edit`} className={styles.editButton}>
            Edit
          </Link>
          {onDelete && (
            <button onClick={handleDelete} className={styles.deleteButton}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
