"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Book,
  BookFormData,
  PaginatedBooksResponse,
  GetBooksResponse,
  CreateBookResponse,
  UpdateBookResponse,
  DeleteBookResponse,
  PaginationInput,
  FilterInput,
} from "@/types";
import { GET_BOOKS, CREATE_BOOK, UPDATE_BOOK, DELETE_BOOK } from "@/lib/books";

interface BookContextType {
  booksData: PaginatedBooksResponse | null;
  isLoading: boolean;
  error: Error | undefined;
  fetchBooks: (pagination?: PaginationInput, filter?: FilterInput) => void;
  getBookById: (id: string) => Book | undefined;
  addBook: (
    book: BookFormData
  ) => Promise<{ success: boolean; message?: string; book?: Book }>;
  updateBook: (
    id: string,
    book: BookFormData
  ) => Promise<{ success: boolean; message?: string }>;
  deleteBook: (id: string) => Promise<{ success: boolean; message?: string }>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export function BookProvider({ children }: { children: ReactNode }) {
  const { data, loading, error, refetch } = useQuery<GetBooksResponse>(
    GET_BOOKS,
    {
      variables: {
        pagination: { page: 1, limit: 10 },
      },
    }
  );

  const booksData = data?.books || null;

  const [createBookMutation] = useMutation<CreateBookResponse>(CREATE_BOOK);
  const [updateBookMutation] = useMutation<UpdateBookResponse>(UPDATE_BOOK);
  const [deleteBookMutation] = useMutation<DeleteBookResponse>(DELETE_BOOK);

  const fetchBooks = useCallback(
    (pagination?: PaginationInput, filter?: FilterInput) => {
      refetch({
        pagination: pagination || { page: 1, limit: 10 },
        filter: filter || {},
      });
    },
    [refetch]
  );

  const getBookById = useCallback(
    (id: string): Book | undefined => {
      return booksData?.books.find((book) => book.id === id);
    },
    [booksData]
  );

  const addBook = async (
    bookData: BookFormData
  ): Promise<{ success: boolean; message?: string; book?: Book }> => {
    try {
      // Debug: Log what we're sending
      console.log("BookContext - Received bookData:", bookData);
      console.log("BookContext - Image to upload:", bookData.image);
      console.log(
        "BookContext - Image is File?",
        bookData.image instanceof File
      );

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
          image: bookData.image || null,
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
          image: bookData.image || null,
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

  const value: BookContextType = {
    booksData,
    isLoading: loading,
    error,
    fetchBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
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
