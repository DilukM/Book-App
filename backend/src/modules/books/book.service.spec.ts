import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { Book } from './book.entity';
import { CreateBookInput, UpdateBookInput } from './book.types';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('BookService', () => {
  let service: BookService;
  let bookRepository: Repository<Book>;

  const mockBook: Book = {
    id: '1',
    title: 'Test Book',
    author: 'Test Author',
    publishedYear: 2024,
    genre: 'Fiction',
    description: 'A test book',
    isbn: '123-456-789',

    createdAt: new Date(),
    updatedAt: new Date(),
  };

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

  const mockBookRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    findAndCount: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  afterEach(() => {
    jest.clearAllMocks();
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

      const createdBook = { ...mockBook, ...createBookInput };
      mockBookRepository.create.mockReturnValue(createdBook);
      mockBookRepository.save.mockResolvedValue(createdBook);

      const result = await service.create(createBookInput);

      expect(result).toBeDefined();
      expect(result.title).toBe('Test Book');
      expect(result.author).toBe('Test Author');
      expect(mockBookRepository.create).toHaveBeenCalledWith(createBookInput);
      expect(mockBookRepository.save).toHaveBeenCalled();
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

      const createdBook = { ...mockBook, ...createBookInput };
      const savedBookWithImage = {
        ...createdBook,
        imageUrl: 'https://cloudinary.com/test-image.jpg',
      };

      mockBookRepository.create.mockReturnValue(createdBook);
      mockBookRepository.save
        .mockResolvedValueOnce(createdBook)
        .mockResolvedValueOnce(savedBookWithImage);

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

      const book1 = { ...mockBook, id: '1' };
      const book2 = { ...mockBook, id: '2' };

      mockBookRepository.create.mockReturnValue(book1);
      mockBookRepository.save
        .mockResolvedValueOnce(book1)
        .mockResolvedValueOnce(book2);

      const result1 = await service.create(createBookInput);

      mockBookRepository.create.mockReturnValue(book2);
      const result2 = await service.create(createBookInput);

      expect(result1.id).not.toBe(result2.id);
    });
  });

  describe('findAll', () => {
    it('should return paginated books response', async () => {
      const books = [mockBook, { ...mockBook, id: '2', title: 'Book 2' }];

      mockBookRepository.findAndCount.mockResolvedValue([books, 2]);

      const result = await service.findAll();

      expect(result).toBeDefined();
      expect(result.books).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should apply pagination correctly', async () => {
      const books = [mockBook];

      mockBookRepository.findAndCount.mockResolvedValue([books, 15]);

      const result = await service.findAll({ page: 2, limit: 5 });

      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
      expect(result.totalPages).toBe(3);
      expect(mockBookRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      mockBookRepository.findOne.mockResolvedValue(mockBook);

      const foundBook = await service.findOne('1');

      expect(foundBook).toBeDefined();
      expect(foundBook.id).toBe('1');
      expect(foundBook.title).toBe('Test Book');
      expect(mockBookRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException when book does not exist', async () => {
      mockBookRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Book with ID non-existent-id not found',
      );
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookInput: UpdateBookInput = {
        title: 'Updated Title',
        author: 'Updated Author',
      };

      const updatedBook = {
        ...mockBook,
        title: 'Updated Title',
        author: 'Updated Author',
      };

      mockBookRepository.findOne.mockResolvedValue(mockBook);
      mockBookRepository.save.mockResolvedValue(updatedBook);

      const result = await service.update('1', updateBookInput);

      expect(result.id).toBe('1');
      expect(result.title).toBe('Updated Title');
      expect(result.author).toBe('Updated Author');
      expect(result.publishedYear).toBe(2024);
      expect(result.genre).toBe('Fiction');
    });

    it('should update book with new image', async () => {
      const mockImage: any = {
        filename: 'new-test.jpg',
        mimetype: 'image/jpeg',
        encoding: '7bit',
        createReadStream: jest.fn(),
      };

      const updatedBook = {
        ...mockBook,
        imageUrl: 'https://cloudinary.com/new-image.jpg',
      };

      mockBookRepository.findOne.mockResolvedValue(mockBook);
      mockBookRepository.save.mockResolvedValue(updatedBook);

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

      const result = await service.update('1', updateBookInput, mockImage);

      expect(result.imageUrl).toBe('https://cloudinary.com/new-image.jpg');

      mockCloudinaryUpload.mockRestore();
      mockCloudinaryDelete.mockRestore();
    });

    it('should throw NotFoundException when updating non-existent book', async () => {
      mockBookRepository.findOne.mockResolvedValue(null);

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
      const bookWithoutImage = { ...mockBook, imageUrl: null };
      mockBookRepository.findOne.mockResolvedValue(bookWithoutImage);
      mockBookRepository.remove.mockResolvedValue(bookWithoutImage);

      await service.remove('1');

      expect(mockBookRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockBookRepository.remove).toHaveBeenCalledWith(bookWithoutImage);
    });

    it('should delete image from Cloudinary when removing book with image', async () => {
      const bookWithImage = {
        ...mockBook,
        imageUrl: 'https://cloudinary.com/test-image.jpg',
      };

      mockBookRepository.findOne.mockResolvedValue(bookWithImage);
      mockBookRepository.remove.mockResolvedValue(bookWithImage);

      const mockCloudinaryDelete = jest.spyOn(
        service as any,
        'deleteFromCloudinary',
      );
      mockCloudinaryDelete.mockResolvedValue(undefined);

      await service.remove('1');

      expect(mockCloudinaryDelete).toHaveBeenCalledWith(bookWithImage.imageUrl);
      expect(mockBookRepository.remove).toHaveBeenCalledWith(bookWithImage);

      mockCloudinaryDelete.mockRestore();
    });

    it('should throw NotFoundException when removing non-existent book', async () => {
      mockBookRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('search', () => {
    it('should search books by title', async () => {
      const searchResults = [{ ...mockBook, title: 'The Great Gatsby' }];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(searchResults),
      };

      mockBookRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const results = await service.search('Great');

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('The Great Gatsby');
    });

    it('should search books by author', async () => {
      const searchResults = [
        { ...mockBook, author: 'George Orwell', title: '1984' },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(searchResults),
      };

      mockBookRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const results = await service.search('Orwell');

      expect(results).toHaveLength(1);
      expect(results[0].author).toBe('George Orwell');
    });

    it('should search books by genre', async () => {
      const searchResults = [
        { ...mockBook, genre: 'Classic Fiction' },
        { ...mockBook, id: '2', genre: 'Classic Fiction' },
        { ...mockBook, id: '3', genre: 'Classic Fiction' },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(searchResults),
      };

      mockBookRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const results = await service.search('Classic');

      expect(results).toHaveLength(3);
    });

    it('should return empty array when no matches found', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockBookRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const results = await service.search('NonExistent');

      expect(results).toEqual([]);
    });
  });
});
