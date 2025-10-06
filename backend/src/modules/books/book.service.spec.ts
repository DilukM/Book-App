import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { Book } from './book.entity';
import { CreateBookInput, UpdateBookInput } from './book.types';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

describe('BookService', () => {
  let service: BookService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        CLOUDINARY_CLOUD_NAME: 'test-cloud',
        CLOUDINARY_API_KEY: 'test-key',
        CLOUDINARY_API_SECRET: 'test-secret',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  afterEach(() => {
    // Clear all books after each test
    if (service) {
      service['books'] = [];
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a book without image', async () => {
      const createBookInput: CreateBookInput = {
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2024,
        genre: 'Fiction',
        description: 'A test book',
        isbn: '123-456-789',
      };

      const result = await service.create(createBookInput);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.title).toBe('Test Book');
      expect(result.author).toBe('Test Author');
      expect(result.publishedYear).toBe(2024);
      expect(result.genre).toBe('Fiction');
      expect(result.description).toBe('A test book');
      expect(result.isbn).toBe('123-456-789');
      expect(result.imageUrl).toBeUndefined();
    });

    it('should create a book with image', async () => {
      const createBookInput: CreateBookInput = {
        title: 'Test Book with Image',
        author: 'Test Author',
        publishedYear: 2024,
        genre: 'Fiction',
      };

      const mockImage: any = {
        filename: 'test.jpg',
        mimetype: 'image/jpeg',
        encoding: '7bit',
        createReadStream: jest.fn(),
      };

      // Mock Cloudinary upload
      const mockCloudinaryUpload = jest.spyOn(
        service as any,
        'uploadToCloudinary',
      );
      mockCloudinaryUpload.mockResolvedValue(
        'https://cloudinary.com/test-image.jpg',
      );

      const result = await service.create(createBookInput, mockImage);

      expect(result).toBeDefined();
      expect(result.imageUrl).toBe('https://cloudinary.com/test-image.jpg');
      expect(mockCloudinaryUpload).toHaveBeenCalledWith(
        mockImage,
        expect.any(String),
      );

      mockCloudinaryUpload.mockRestore();
    });

    it('should generate unique IDs for multiple books', async () => {
      const createBookInput: CreateBookInput = {
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2024,
        genre: 'Fiction',
      };

      const book1 = await service.create(createBookInput);
      const book2 = await service.create(createBookInput);

      expect(book1.id).not.toBe(book2.id);
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no books exist', () => {
      const result = service.findAll();
      expect(result).toEqual([]);
    });

    it('should return all books', async () => {
      const createBookInput1: CreateBookInput = {
        title: 'Book 1',
        author: 'Author 1',
        publishedYear: 2024,
        genre: 'Fiction',
      };

      const createBookInput2: CreateBookInput = {
        title: 'Book 2',
        author: 'Author 2',
        publishedYear: 2023,
        genre: 'Non-Fiction',
      };

      await service.create(createBookInput1);
      await service.create(createBookInput2);

      const result = service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Book 1');
      expect(result[1].title).toBe('Book 2');
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const createBookInput: CreateBookInput = {
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2024,
        genre: 'Fiction',
      };

      const createdBook = await service.create(createBookInput);
      const foundBook = service.findOne(createdBook.id);

      expect(foundBook).toBeDefined();
      expect(foundBook.id).toBe(createdBook.id);
      expect(foundBook.title).toBe('Test Book');
    });

    it('should throw NotFoundException when book does not exist', () => {
      expect(() => service.findOne('non-existent-id')).toThrow(
        NotFoundException,
      );
      expect(() => service.findOne('non-existent-id')).toThrow(
        'Book with ID non-existent-id not found',
      );
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const createBookInput: CreateBookInput = {
        title: 'Original Title',
        author: 'Original Author',
        publishedYear: 2024,
        genre: 'Fiction',
      };

      const createdBook = await service.create(createBookInput);

      const updateBookInput: UpdateBookInput = {
        title: 'Updated Title',
        author: 'Updated Author',
      };

      const updatedBook = await service.update(createdBook.id, updateBookInput);

      expect(updatedBook.id).toBe(createdBook.id);
      expect(updatedBook.title).toBe('Updated Title');
      expect(updatedBook.author).toBe('Updated Author');
      expect(updatedBook.publishedYear).toBe(2024); // Should keep original
      expect(updatedBook.genre).toBe('Fiction'); // Should keep original
    });

    it('should update book with new image', async () => {
      const createBookInput: CreateBookInput = {
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2024,
        genre: 'Fiction',
      };

      const createdBook = await service.create(createBookInput);

      const mockImage: any = {
        filename: 'new-test.jpg',
        mimetype: 'image/jpeg',
        encoding: '7bit',
        createReadStream: jest.fn(),
      };

      const mockCloudinaryUpload = jest.spyOn(
        service as any,
        'uploadToCloudinary',
      );
      mockCloudinaryUpload.mockResolvedValue(
        'https://cloudinary.com/new-image.jpg',
      );

      const mockCloudinaryDelete = jest.spyOn(
        service as any,
        'deleteFromCloudinary',
      );
      mockCloudinaryDelete.mockResolvedValue(undefined);

      const updateBookInput: UpdateBookInput = {
        title: 'Updated Book',
      };

      const updatedBook = await service.update(
        createdBook.id,
        updateBookInput,
        mockImage,
      );

      expect(updatedBook.imageUrl).toBe('https://cloudinary.com/new-image.jpg');

      mockCloudinaryUpload.mockRestore();
      mockCloudinaryDelete.mockRestore();
    });

    it('should throw NotFoundException when updating non-existent book', async () => {
      const updateBookInput: UpdateBookInput = {
        title: 'Updated Title',
      };

      await expect(
        service.update('non-existent-id', updateBookInput),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      const createBookInput: CreateBookInput = {
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2024,
        genre: 'Fiction',
      };

      const createdBook = await service.create(createBookInput);

      await service.remove(createdBook.id);

      expect(() => service.findOne(createdBook.id)).toThrow(NotFoundException);
    });

    it('should delete image from Cloudinary when removing book with image', async () => {
      const createBookInput: CreateBookInput = {
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2024,
        genre: 'Fiction',
      };

      const mockImage: any = {
        filename: 'test.jpg',
        mimetype: 'image/jpeg',
        encoding: '7bit',
        createReadStream: jest.fn(),
      };

      const mockCloudinaryUpload = jest.spyOn(
        service as any,
        'uploadToCloudinary',
      );
      mockCloudinaryUpload.mockResolvedValue(
        'https://cloudinary.com/test-image.jpg',
      );

      const mockCloudinaryDelete = jest.spyOn(
        service as any,
        'deleteFromCloudinary',
      );
      mockCloudinaryDelete.mockResolvedValue(undefined);

      const createdBook = await service.create(createBookInput, mockImage);

      await service.remove(createdBook.id);

      expect(mockCloudinaryDelete).toHaveBeenCalled();

      mockCloudinaryUpload.mockRestore();
      mockCloudinaryDelete.mockRestore();
    });

    it('should throw NotFoundException when removing non-existent book', async () => {
      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      const books: CreateBookInput[] = [
        {
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          publishedYear: 1925,
          genre: 'Classic Fiction',
        },
        {
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          publishedYear: 1960,
          genre: 'Classic Fiction',
        },
        {
          title: '1984',
          author: 'George Orwell',
          publishedYear: 1949,
          genre: 'Dystopian',
        },
        {
          title: 'The Catcher in the Rye',
          author: 'J.D. Salinger',
          publishedYear: 1951,
          genre: 'Classic Fiction',
        },
      ];

      for (const book of books) {
        await service.create(book);
      }
    });

    it('should search books by title', () => {
      const results = service.search('Great');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('The Great Gatsby');
    });

    it('should search books by author', () => {
      const results = service.search('Orwell');
      expect(results).toHaveLength(1);
      expect(results[0].author).toBe('George Orwell');
    });

    it('should search books by genre', () => {
      const results = service.search('Classic');
      expect(results).toHaveLength(3);
    });

    it('should be case-insensitive', () => {
      const results = service.search('gatsby');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('The Great Gatsby');
    });

    it('should return empty array when no matches found', () => {
      const results = service.search('NonExistent');
      expect(results).toEqual([]);
    });

    it('should match partial strings', () => {
      const results = service.search('Kill');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('To Kill a Mockingbird');
    });
  });
});
