import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BookService } from './book.service';
import { Book } from './book.entity';
import {
  CreateBookInput,
  UpdateBookInput,
  BooksResponse,
  DeleteBookResponse,
} from './book.types';
import type { FileUpload } from './book.types';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

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
  async createBook(
    @Args('input') createBookInput: CreateBookInput,
    @Args({ name: 'image', type: () => GraphQLUpload, nullable: true })
    image?: FileUpload,
  ): Promise<Book> {
    return this.bookService.create(createBookInput, image);
  }

  @Mutation(() => Book)
  async updateBook(
    @Args('id') id: string,
    @Args('input') updateBookInput: UpdateBookInput,
    @Args({ name: 'image', type: () => GraphQLUpload, nullable: true })
    image?: FileUpload,
  ): Promise<Book> {
    return this.bookService.update(id, updateBookInput, image);
  }

  @Mutation(() => DeleteBookResponse)
  async deleteBook(@Args('id') id: string): Promise<DeleteBookResponse> {
    await this.bookService.remove(id);
    return { message: 'Book deleted successfully' };
  }
}
