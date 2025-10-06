"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  const {
    booksData,
    fetchBooks,
    deleteBook,
    isLoading: booksLoading,
  } = useBooks();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [authorQuery, setAuthorQuery] = useState("");

  // Applied filters - these are set when user clicks search button
  const [appliedTitle, setAppliedTitle] = useState("");
  const [appliedAuthor, setAppliedAuthor] = useState("");
  const [appliedGenre, setAppliedGenre] = useState("");

  const itemsPerPage = 6;

  const genres = [
    "Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Romance",
  ];

  // Initial load - fetch all books
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchBooks({ page: 1, limit: itemsPerPage }, undefined);
  }, [isAuthenticated, fetchBooks]);

  // Fetch books when applied filters or page changes
  useEffect(() => {
    if (!isAuthenticated) return;

    const filter: { title?: string; author?: string; genre?: string } = {};

    if (appliedTitle) filter.title = appliedTitle;
    if (appliedAuthor) filter.author = appliedAuthor;
    if (appliedGenre) filter.genre = appliedGenre;

    fetchBooks(
      { page: currentPage, limit: itemsPerPage },
      Object.keys(filter).length > 0 ? filter : undefined
    );
  }, [
    currentPage,
    appliedTitle,
    appliedAuthor,
    appliedGenre,
    fetchBooks,
    isAuthenticated,
  ]);

  const handleSearch = useCallback(() => {
    // Apply the current filter values and reset to page 1
    setAppliedTitle(searchQuery);
    setAppliedAuthor(authorQuery);
    setAppliedGenre(selectedGenre);
    setCurrentPage(1);
  }, [searchQuery, authorQuery, selectedGenre]);

  const handleClearFilters = useCallback(() => {
    // Clear all filter inputs and applied filters
    setSearchQuery("");
    setAuthorQuery("");
    setSelectedGenre("");
    setAppliedTitle("");
    setAppliedAuthor("");
    setAppliedGenre("");
    setCurrentPage(1);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      const result = await deleteBook(id);
      if (result.success) {
        // Refresh current page
        if (
          booksData &&
          booksData.books &&
          booksData.books.length === 1 &&
          currentPage > 1
        ) {
          setCurrentPage(currentPage - 1);
        } else {
          // Refetch current page
          const filter: { title?: string; author?: string; genre?: string } =
            {};
          if (appliedTitle) filter.title = appliedTitle;
          if (appliedAuthor) filter.author = appliedAuthor;
          if (appliedGenre) filter.genre = appliedGenre;

          fetchBooks(
            { page: currentPage, limit: itemsPerPage },
            Object.keys(filter).length > 0 ? filter : undefined
          );
        }
      }
    },
    [
      deleteBook,
      booksData,
      currentPage,
      appliedTitle,
      appliedAuthor,
      appliedGenre,
      fetchBooks,
    ]
  );

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
          onChange={setSearchQuery}
          placeholder="Search by title..."
        />

        <SearchBar
          value={authorQuery}
          onChange={setAuthorQuery}
          placeholder="Search by author..."
        />

        <div className={styles.genreFilter}>
          <label htmlFor="genre" className={styles.filterLabel}>
            Genre:
          </label>
          <select
            id="genre"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
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

        <button
          onClick={handleSearch}
          className={styles.searchButton}
          type="button"
        >
          Search
        </button>

        <button
          onClick={handleClearFilters}
          className={styles.clearButton}
          type="button"
        >
          Clear
        </button>
      </div>

      {!booksData || !booksData.books || booksData.books.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📚</div>
          <h2 className={styles.emptyTitle}>No books found</h2>
          <p className={styles.emptyText}>
            {searchQuery || selectedGenre || authorQuery
              ? "Try adjusting your search filters"
              : "Start by adding your first book to the collection"}
          </p>
        </div>
      ) : (
        <>
          <div className={styles.results}>
            <p className={styles.resultsText}>
              Showing {booksData.books.length} of {booksData.total} books
              {booksData.total > 0 &&
                ` (Page ${booksData.page} of ${booksData.totalPages})`}
            </p>
          </div>

          <div className={styles.grid}>
            {booksData.books.map((book) => (
              <BookCard key={book.id} book={book} onDelete={handleDelete} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={booksData.totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
