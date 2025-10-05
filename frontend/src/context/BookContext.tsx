"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Book,
  BookFormData,
  PaginatedResponse,
  BookFilters,
  GetBooksResponse,
  GetBookResponse,
  CreateBookResponse,
  UpdateBookResponse,
  DeleteBookResponse,
} from "@/types";
import {
  GET_BOOKS,
  GET_BOOK,
  CREATE_BOOK,
  UPDATE_BOOK,
  DELETE_BOOK,
} from "@/lib/books";

interface BookContextType {
  books: Book[];
  isLoading: boolean;
  getBooks: (
    page?: number,
    limit?: number,
    filters?: BookFilters
  ) => PaginatedResponse<Book>;
  getBookById: (id: string) => Book | undefined;
  addBook: (
    book: BookFormData
  ) => Promise<{ success: boolean; message?: string; book?: Book }>;
  updateBook: (
    id: string,
    book: BookFormData
  ) => Promise<{ success: boolean; message?: string }>;
  deleteBook: (id: string) => Promise<{ success: boolean; message?: string }>;
  searchBooks: (query: string) => Book[];
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export function BookProvider({ children }: { children: ReactNode }) {
  const { data, loading, refetch } = useQuery<GetBooksResponse>(GET_BOOKS);
  const books = data?.books || [];

  const [createBookMutation] = useMutation<CreateBookResponse>(CREATE_BOOK);
  const [updateBookMutation] = useMutation<UpdateBookResponse>(UPDATE_BOOK);
  const [deleteBookMutation] = useMutation<DeleteBookResponse>(DELETE_BOOK);

  const getBooks = (
    page: number = 1,
    limit: number = 10,
    filters?: BookFilters
  ): PaginatedResponse<Book> => {
    let filteredBooks = [...books];

    // Apply filters
    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredBooks = filteredBooks.filter(
          (book) =>
            book.title.toLowerCase().includes(searchLower) ||
            book.author.toLowerCase().includes(searchLower) ||
            book.genre.toLowerCase().includes(searchLower)
        );
      }
      if (filters.genre) {
        filteredBooks = filteredBooks.filter(
          (book) => book.genre === filters.genre
        );
      }
      if (filters.author) {
        filteredBooks = filteredBooks.filter((book) =>
          book.author.toLowerCase().includes(filters.author!.toLowerCase())
        );
      }
    }

    const total = filteredBooks.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedBooks = filteredBooks.slice(start, end);

    return {
      data: paginatedBooks,
      total,
      page,
      totalPages,
    };
  };

  const getBookById = (id: string): Book | undefined => {
    return books.find((book) => book.id === id);
  };

  const addBook = async (
    bookData: BookFormData
  ): Promise<{ success: boolean; message?: string; book?: Book }> => {
    try {
      const { data } = await createBookMutation({
        variables: {
          input: {
            title: bookData.title,
            author: bookData.author,
            publishedYear: Number(bookData.publishedYear),
            genre: bookData.genre,
            description: bookData.description || undefined,
            isbn: bookData.isbn || undefined,
          },
        },
      });

      if (data?.createBook) {
        await refetch();
        return {
          success: true,
          message: "Book added successfully",
          book: data.createBook,
        };
      }
      return { success: false, message: "Failed to add book" };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to add book";
      return { success: false, message };
    }
  };

  const updateBook = async (
    id: string,
    bookData: BookFormData
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const { data } = await updateBookMutation({
        variables: {
          id,
          input: {
            title: bookData.title,
            author: bookData.author,
            publishedYear: Number(bookData.publishedYear),
            genre: bookData.genre,
            description: bookData.description || undefined,
            isbn: bookData.isbn || undefined,
          },
        },
      });

      if (data?.updateBook) {
        await refetch();
        return { success: true, message: "Book updated successfully" };
      }
      return { success: false, message: "Failed to update book" };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update book";
      return { success: false, message };
    }
  };

  const deleteBook = async (
    id: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const { data } = await deleteBookMutation({
        variables: { id },
      });

      if (data?.deleteBook) {
        await refetch();
        return { success: true, message: data.deleteBook.message };
      }
      return { success: false, message: "Failed to delete book" };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete book";
      return { success: false, message };
    }
  };

  const searchBooks = (query: string): Book[] => {
    if (!query) return books;

    const searchLower = query.toLowerCase();
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.genre.toLowerCase().includes(searchLower)
    );
  };

  const value: BookContextType = {
    books,
    isLoading: loading,
    getBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    searchBooks,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

export function useBooks() {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
}
