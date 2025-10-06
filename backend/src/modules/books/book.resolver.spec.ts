import { Test, TestingModule } from '@nestjs/testing';
import { BookResolver } from './book.resolver';
import { BookService } from './book.service';
import { CreateBookInput, UpdateBookInput } from './book.types';
import { NotFoundException } from '@nestjs/common';

describe('BookResolver', () => {
  let resolver: BookResolver;
  let service: BookService;

  const mockBookService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookResolver,
        {
          provide: BookService,
          useValue: mockBookService,
        },
      ],
    }).compile();

    resolver = module.get<BookResolver>(BookResolver);
    service = module.get<BookService>(BookService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('books', () => {
    it('should return an array of books', async () => {
      const mockBooks = [
        {
          id: '1',
          title: 'Book 1',
          author: 'Author 1',
          publishedYear: 2024,
          genre: 'Fiction',
        },
        {
          id: '2',
          title: 'Book 2',
          author: 'Author 2',
          publishedYear: 2023,
          genre: 'Non-Fiction',
        },
      ];

      mockBookService.findAll.mockReturnValue(mockBooks);

      const result = await resolver.books();

      expect(result).toEqual(mockBooks);
      expect(mockBookService.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no books exist', async () => {
      mockBookService.findAll.mockReturnValue([]);

      const result = await resolver.books();

      expect(result).toEqual([]);
      expect(mockBookService.findAll).toHaveBeenCalled();
    });
  });

  describe('book', () => {
    it('should return a single book by id', async () => {
      const mockBook = {
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2024,
        genre: 'Fiction',
      };

      mockBookService.findOne.mockReturnValue(mockBook);

      const result = await resolver.book('1');

      expect(result).toEqual(mockBook);
      expect(mockBookService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when book does not exist', async () => {
      mockBookService.findOne.mockImplementation(() => {
        throw new NotFoundException('Book with ID 999 not found');
      });

      await expect(resolver.book('999')).rejects.toThrow(NotFoundException);
      expect(mockBookService.findOne).toHaveBeenCalledWith('999');
    });
  });

  describe('searchBooks', () => {
    it('should return books matching the search query', async () => {
      const mockBooks = [
        {
          id: '1',
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          publishedYear: 1925,
          genre: 'Classic Fiction',
        },
      ];

      mockBookService.search.mockReturnValue(mockBooks);

      const result = await resolver.searchBooks('Gatsby');

      expect(result).toEqual(mockBooks);
      expect(mockBookService.search).toHaveBeenCalledWith('Gatsby');
    });

    it('should return empty array when no matches found', async () => {
      mockBookService.search.mockReturnValue([]);

      const result = await resolver.searchBooks('NonExistent');

      expect(result).toEqual([]);
      expect(mockBookService.search).toHaveBeenCalledWith('NonExistent');
    });
  });

  describe('createBook', () => {
    it('should create a book without image', async () => {
      const createBookInput: CreateBookInput = {
        title: 'New Book',
        author: 'New Author',
        publishedYear: 2024,
        genre: 'Fiction',
        description: 'A new book',
        isbn: '123-456-789',
      };

      const mockCreatedBook = {
        id: '1',
        ...createBookInput,
      };

      mockBookService.create.mockResolvedValue(mockCreatedBook);

      const result = await resolver.createBook(createBookInput);

      expect(result).toEqual(mockCreatedBook);
      expect(mockBookService.create).toHaveBeenCalledWith(
        createBookInput,
        undefined,
      );
    });

    it('should create a book with image', async () => {
      const createBookInput: CreateBookInput = {
        title: 'New Book',
        author: 'New Author',
        publishedYear: 2024,
        genre: 'Fiction',
      };

      const mockImage: any = {
        filename: 'test.jpg',
        mimetype: 'image/jpeg',
        encoding: '7bit',
        createReadStream: jest.fn(),
      };

      const mockCreatedBook = {
        id: '1',
        ...createBookInput,
        imageUrl: 'https://cloudinary.com/test-image.jpg',
      };

      mockBookService.create.mockResolvedValue(mockCreatedBook);

      const result = await resolver.createBook(createBookInput, mockImage);

      expect(result).toEqual(mockCreatedBook);
      expect(mockBookService.create).toHaveBeenCalledWith(
        createBookInput,
        mockImage,
      );
    });

    it('should handle errors during book creation', async () => {
      const createBookInput: CreateBookInput = {
        title: 'New Book',
        author: 'New Author',
        publishedYear: 2024,
        genre: 'Fiction',
      };

      mockBookService.create.mockRejectedValue(new Error('Creation failed'));

      await expect(resolver.createBook(createBookInput)).rejects.toThrow(
        'Creation failed',
      );
    });
  });

  describe('updateBook', () => {
    it('should update a book without image', async () => {
      const updateBookInput: UpdateBookInput = {
        title: 'Updated Title',
        author: 'Updated Author',
      };

      const mockUpdatedBook = {
        id: '1',
        title: 'Updated Title',
        author: 'Updated Author',
        publishedYear: 2024,
        genre: 'Fiction',
      };

      mockBookService.update.mockResolvedValue(mockUpdatedBook);

      const result = await resolver.updateBook('1', updateBookInput);

      expect(result).toEqual(mockUpdatedBook);
      expect(mockBookService.update).toHaveBeenCalledWith(
        '1',
        updateBookInput,
        undefined,
      );
    });

    it('should update a book with image', async () => {
      const updateBookInput: UpdateBookInput = {
        title: 'Updated Title',
      };

      const mockImage: any = {
        filename: 'new-test.jpg',
        mimetype: 'image/jpeg',
        encoding: '7bit',
        createReadStream: jest.fn(),
      };

      const mockUpdatedBook = {
        id: '1',
        title: 'Updated Title',
        author: 'Test Author',
        publishedYear: 2024,
        genre: 'Fiction',
        imageUrl: 'https://cloudinary.com/new-image.jpg',
      };

      mockBookService.update.mockResolvedValue(mockUpdatedBook);

      const result = await resolver.updateBook('1', updateBookInput, mockImage);

      expect(result).toEqual(mockUpdatedBook);
      expect(mockBookService.update).toHaveBeenCalledWith(
        '1',
        updateBookInput,
        mockImage,
      );
    });

    it('should throw NotFoundException when updating non-existent book', async () => {
      const updateBookInput: UpdateBookInput = {
        title: 'Updated Title',
      };

      mockBookService.update.mockRejectedValue(
        new NotFoundException('Book with ID 999 not found'),
      );

      await expect(resolver.updateBook('999', updateBookInput)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteBook', () => {
    it('should delete a book and return success message', async () => {
      mockBookService.remove.mockResolvedValue(undefined);

      const result = await resolver.deleteBook('1');

      expect(result).toEqual({ message: 'Book deleted successfully' });
      expect(mockBookService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when deleting non-existent book', async () => {
      mockBookService.remove.mockRejectedValue(
        new NotFoundException('Book with ID 999 not found'),
      );

      await expect(resolver.deleteBook('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockBookService.remove).toHaveBeenCalledWith('999');
    });
  });
});
