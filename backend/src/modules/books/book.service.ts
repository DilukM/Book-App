import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Book } from './book.entity';
import { CreateBookInput, UpdateBookInput, FileUpload } from './book.types';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { PaginationInput } from './dto/pagination.input';
import { FilterInput } from './dto/filter.input';
import { PaginatedBooksResponse } from './dto/paginated-books.response';

@Injectable()
export class BookService {
  private books: Book[] = [];

  constructor(private configService: ConfigService) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async create(
    createBookInput: CreateBookInput,
    image?: FileUpload,
  ): Promise<Book> {
    const book: Book = {
      id: uuidv4(),
      ...createBookInput,
    };

    if (image) {
      const imageUrl = await this.uploadToCloudinary(image, book.id);
      book.imageUrl = imageUrl;
    }

    this.books.push(book);
    return book;
  }

  private async uploadToCloudinary(
    image: FileUpload,
    bookId: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'books',
          public_id: `${bookId}-${Date.now()}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Upload failed: No result returned'));
          }
        },
      );

      const stream = image.createReadStream();
      stream.pipe(uploadStream);
    });
  }

  private async deleteFromCloudinary(imageUrl: string): Promise<void> {
    try {
      // Extract public_id from Cloudinary URL
      // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
      const urlParts = imageUrl.split('/');
      const fileWithExtension = urlParts[urlParts.length - 1];
      const publicId = `books/${fileWithExtension.split('.')[0]}`;

      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      // Don't throw error, just log it
    }
  }

  findAll(
    paginationInput?: PaginationInput,
    filterInput?: FilterInput,
  ): PaginatedBooksResponse {
    const page = paginationInput?.page || 1;
    const limit = paginationInput?.limit || 10;

    // Apply filters
    let filteredBooks = [...this.books];

    if (filterInput) {
      if (filterInput.title) {
        const titleLower = filterInput.title.toLowerCase();
        filteredBooks = filteredBooks.filter((book) =>
          book.title.toLowerCase().includes(titleLower),
        );
      }

      if (filterInput.author) {
        const authorLower = filterInput.author.toLowerCase();
        filteredBooks = filteredBooks.filter((book) =>
          book.author.toLowerCase().includes(authorLower),
        );
      }

      if (filterInput.genre) {
        const genreLower = filterInput.genre.toLowerCase();
        filteredBooks = filteredBooks.filter((book) =>
          book.genre.toLowerCase().includes(genreLower),
        );
      }
    }

    const total = filteredBooks.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    // Apply pagination
    const paginatedBooks = filteredBooks.slice(skip, skip + limit);

    return {
      books: paginatedBooks,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  findOne(id: string): Book {
    const book = this.books.find((b) => b.id === id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(
    id: string,
    updateBookInput: UpdateBookInput,
    image?: FileUpload,
  ): Promise<Book> {
    const bookIndex = this.books.findIndex((b) => b.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    const updatedBook = { ...this.books[bookIndex], ...updateBookInput };

    if (image) {
      // Delete old image from Cloudinary if exists
      if (updatedBook.imageUrl) {
        await this.deleteFromCloudinary(updatedBook.imageUrl);
      }

      const imageUrl = await this.uploadToCloudinary(image, id);
      updatedBook.imageUrl = imageUrl;
    }

    this.books[bookIndex] = updatedBook;
    return updatedBook;
  }

  async remove(id: string): Promise<void> {
    const bookIndex = this.books.findIndex((b) => b.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    const book = this.books[bookIndex];

    // Delete image from Cloudinary if exists
    if (book.imageUrl) {
      await this.deleteFromCloudinary(book.imageUrl);
    }

    this.books.splice(bookIndex, 1);
  }

  search(query: string): Book[] {
    const lowerQuery = query.toLowerCase();
    return this.books.filter(
      (book) =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery) ||
        book.genre.toLowerCase().includes(lowerQuery),
    );
  }
}
