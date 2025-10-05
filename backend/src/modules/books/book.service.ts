import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Book } from './book.entity';
import { CreateBookInput, UpdateBookInput } from './book.types';

@Injectable()
export class BookService {
  private books: Book[] = [];

  create(createBookInput: CreateBookInput): Book {
    const book: Book = {
      id: uuidv4(),
      ...createBookInput,
    };
    this.books.push(book);
    return book;
  }

  findAll(): Book[] {
    return this.books;
  }

  findOne(id: string): Book {
    const book = this.books.find(b => b.id === id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  update(id: string, updateBookInput: UpdateBookInput): Book {
    const bookIndex = this.books.findIndex(b => b.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    const updatedBook = { ...this.books[bookIndex], ...updateBookInput };
    this.books[bookIndex] = updatedBook;
    return updatedBook;
  }

  remove(id: string): void {
    const bookIndex = this.books.findIndex(b => b.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    this.books.splice(bookIndex, 1);
  }

  search(query: string): Book[] {
    const lowerQuery = query.toLowerCase();
    return this.books.filter(
      book =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery) ||
        book.genre.toLowerCase().includes(lowerQuery),
    );
  }
}