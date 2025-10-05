"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useBooks } from "@/context/BookContext";
import { BookFormData } from "@/types";
import styles from "./add.module.css";

export default function AddBookPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { addBook } = useBooks();

  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    publishedYear: "",
    genre: "",
    description: "",
    isbn: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validation
    if (
      !formData.title ||
      !formData.author ||
      !formData.publishedYear ||
      !formData.genre
    ) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    const year = Number(formData.publishedYear);
    if (isNaN(year) || year < 1000 || year > new Date().getFullYear() + 1) {
      setError("Please enter a valid year");
      setIsSubmitting(false);
      return;
    }

    const result = await addBook(formData);
    setIsSubmitting(false);

    if (result.success) {
      router.push(`/books/${result.book?.id}`);
    } else {
      setError(result.message || "Failed to add book");
    }
  };

  const genres = [
    "Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Romance",
    "Thriller",
    "Biography",
    "History",
    "Other",
  ];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Add New Book</h1>
        <p className={styles.subtitle}>Add a book to your collection</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Title <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter book title"
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="author" className={styles.label}>
              Author <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter author name"
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="publishedYear" className={styles.label}>
                Published Year <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="publishedYear"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g., 2024"
                min="1000"
                max={new Date().getFullYear() + 1}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="genre" className={styles.label}>
                Genre <span className={styles.required}>*</span>
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className={styles.select}
                disabled={isSubmitting}
              >
                <option value="">Select a genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="isbn" className={styles.label}>
              ISBN (Optional)
            </label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter ISBN number"
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Enter book description"
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Book..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
