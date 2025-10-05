import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BookService } from './book.service';
import { Book } from './book.entity';
import { CreateBookInput, UpdateBookInput, BooksResponse, DeleteBookResponse } from './book.types';

@Resolver(() => Book)
export class BookResolver {
  constructor(private bookService: BookService) {}

  @Query(() => [Book])
  async books(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @Query(() => Book)
  async book(@Args('id') id: string): Promise<Book> {
    return this.bookService.findOne(id);
  }

  @Query(() => [Book])
  async searchBooks(@Args('query') query: string): Promise<Book[]> {
    return this.bookService.search(query);
  }

  @Mutation(() => Book)
  async createBook(@Args('input') createBookInput: CreateBookInput): Promise<Book> {
    return this.bookService.create(createBookInput);
  }

  @Mutation(() => Book)
  async updateBook(
    @Args('id') id: string,
    @Args('input') updateBookInput: UpdateBookInput,
  ): Promise<Book> {
    return this.bookService.update(id, updateBookInput);
  }

  @Mutation(() => DeleteBookResponse)
  async deleteBook(@Args('id') id: string): Promise<DeleteBookResponse> {
    this.bookService.remove(id);
    return { message: 'Book deleted successfully' };
  }
}