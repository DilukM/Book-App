import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookInput, UpdateBookInput, FileUpload } from './book.types';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { PaginationInput } from './dto/pagination.input';
import { FilterInput } from './dto/filter.input';
import { PaginatedBooksResponse } from './dto/paginated-books.response';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private configService: ConfigService,
  ) {
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
    const book = this.bookRepository.create(createBookInput);

    if (image) {
      // Save first to get the ID
      const savedBook = await this.bookRepository.save(book);
      const imageUrl = await this.uploadToCloudinary(image, savedBook.id);
      savedBook.imageUrl = imageUrl;
      return this.bookRepository.save(savedBook);
    }

    return this.bookRepository.save(book);
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

  async findAll(
    paginationInput?: PaginationInput,
    filterInput?: FilterInput,
  ): Promise<PaginatedBooksResponse> {
    const page = paginationInput?.page || 1;
    const limit = paginationInput?.limit || 10;
    const skip = (page - 1) * limit;

    // Build where clause for filters
    const where: any = {};

    if (filterInput) {
      if (filterInput.title) {
        where.title = Like(`%${filterInput.title}%`);
      }
      if (filterInput.author) {
        where.author = Like(`%${filterInput.author}%`);
      }
      if (filterInput.genre) {
        where.genre = Like(`%${filterInput.genre}%`);
      }
    }

    // Get books with pagination
    const [books, total] = await this.bookRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      books,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
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
    const book = await this.findOne(id);

    if (image) {
      // Delete old image from Cloudinary if exists
      if (book.imageUrl) {
        await this.deleteFromCloudinary(book.imageUrl);
      }

      const imageUrl = await this.uploadToCloudinary(image, id);
      book.imageUrl = imageUrl;
    }

    Object.assign(book, updateBookInput);
    return this.bookRepository.save(book);
  }

  async remove(id: string): Promise<void> {
    const book = await this.findOne(id);

    // Delete image from Cloudinary if exists
    if (book.imageUrl) {
      await this.deleteFromCloudinary(book.imageUrl);
    }

    await this.bookRepository.remove(book);
  }

  async search(query: string): Promise<Book[]> {
    const lowerQuery = `%${query}%`;
    return this.bookRepository
      .createQueryBuilder('book')
      .where('LOWER(book.title) LIKE LOWER(:query)', { query: lowerQuery })
      .orWhere('LOWER(book.author) LIKE LOWER(:query)', { query: lowerQuery })
      .orWhere('LOWER(book.genre) LIKE LOWER(:query)', { query: lowerQuery })
      .getMany();
  }
}
