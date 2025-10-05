"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useBooks } from "@/context/BookContext";
import BookCard from "@/components/BookCard/BookCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import Pagination from "@/components/Pagination/Pagination";
import Loading from "@/components/Loading/Loading";
import styles from "./books.module.css";

export default function BooksPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { getBooks, deleteBook, isLoading: booksLoading } = useBooks();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const itemsPerPage = 6;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || booksLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const paginatedData = getBooks(currentPage, itemsPerPage, {
    search: searchQuery,
    genre: selectedGenre,
  });

  const genres = [
    "Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Romance",
  ];

  const handleDelete = async (id: string) => {
    const result = await deleteBook(id);
    if (result.success) {
      // Refresh current page
      if (paginatedData.data.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Book Collection</h1>
        <p className={styles.subtitle}>
          Explore and manage your personal library
        </p>
      </div>

      <div className={styles.filters}>
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by title, author, or genre..."
        />

        <div className={styles.genreFilter}>
          <label htmlFor="genre" className={styles.filterLabel}>
            Genre:
          </label>
          <select
            id="genre"
            value={selectedGenre}
            onChange={handleGenreChange}
            className={styles.select}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {paginatedData.data.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📚</div>
          <h2 className={styles.emptyTitle}>No books found</h2>
          <p className={styles.emptyText}>
            {searchQuery || selectedGenre
              ? "Try adjusting your search filters"
              : "Start by adding your first book to the collection"}
          </p>
        </div>
      ) : (
        <>
          <div className={styles.results}>
            <p className={styles.resultsText}>
              Showing {paginatedData.data.length} of {paginatedData.total} books
            </p>
          </div>

          <div className={styles.grid}>
            {paginatedData.data.map((book) => (
              <BookCard key={book.id} book={book} onDelete={handleDelete} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={paginatedData.totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
