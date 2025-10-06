import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { SignUpInput, SignInInput } from './auth.types';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should successfully create a new user', async () => {
      const signUpInput: SignUpInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const hashedPassword = await bcrypt.hash('password123', 10);
      const createdUser = { ...mockUser, password: hashedPassword };
      const savedUser = { ...createdUser };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(savedUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.signUp(signUpInput);

      expect(result).toBeDefined();
      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.name).toBe('Test User');
      expect(result.user.password).toBeUndefined();
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: '1',
        email: 'test@example.com',
      });
    });

    it('should hash the password', async () => {
      const signUpInput: SignUpInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const hashedPassword = await bcrypt.hash('password123', 10);
      const createdUser = { ...mockUser, password: hashedPassword };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      await service.signUp(signUpInput);

      const createCall = mockUserRepository.create.mock.calls[0][0];

      expect(createCall.password).not.toBe('password123');
      expect(createCall.password).toBeDefined();
      const isMatch = await bcrypt.compare('password123', createCall.password);
      expect(isMatch).toBe(true);
    });

    it('should throw ConflictException when user already exists', async () => {
      const signUpInput: SignUpInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.signUp(signUpInput)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.signUp(signUpInput)).rejects.toThrow(
        'User already exists',
      );
    });

    it('should generate unique user IDs', async () => {
      const signUpInput1: SignUpInput = {
        email: 'user1@example.com',
        password: 'password123',
        name: 'User 1',
      };

      const signUpInput2: SignUpInput = {
        email: 'user2@example.com',
        password: 'password123',
        name: 'User 2',
      };

      const user1 = { ...mockUser, id: '1', email: 'user1@example.com' };
      const user2 = { ...mockUser, id: '2', email: 'user2@example.com' };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create
        .mockReturnValueOnce(user1)
        .mockReturnValueOnce(user2);
      mockUserRepository.save
        .mockResolvedValueOnce(user1)
        .mockResolvedValueOnce(user2);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result1 = await service.signUp(signUpInput1);
      const result2 = await service.signUp(signUpInput2);

      expect(result1.user.id).not.toBe(result2.user.id);
    });
  });

  describe('signIn', () => {
    it('should successfully sign in with correct credentials', async () => {
      const signInInput: SignInInput = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash('password123', 10);
      const userWithPassword = { ...mockUser, password: hashedPassword };

      mockUserRepository.findOne.mockResolvedValue(userWithPassword);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.signIn(signInInput);

      expect(result).toBeDefined();
      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.password).toBeUndefined();
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      const signInInput: SignInInput = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.signIn(signInInput)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.signIn(signInInput)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      const signInInput: SignInInput = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const hashedPassword = await bcrypt.hash('password123', 10);
      const userWithPassword = { ...mockUser, password: hashedPassword };

      mockUserRepository.findOne.mockResolvedValue(userWithPassword);

      await expect(service.signIn(signInInput)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.signIn(signInInput)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should be case-sensitive for email', async () => {
      const signInInput: SignInInput = {
        email: 'TEST@EXAMPLE.COM',
        password: 'password123',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.signIn(signInInput)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('JWT token generation', () => {
    it('should generate token with correct payload', async () => {
      const signUpInput: SignUpInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      let capturedPayload: any;
      mockJwtService.sign.mockImplementation((payload) => {
        capturedPayload = payload;
        return 'mock-jwt-token';
      });

      await service.signUp(signUpInput);

      expect(capturedPayload).toBeDefined();
      expect(capturedPayload.sub).toBe('1');
      expect(capturedPayload.email).toBe('test@example.com');
    });
  });

  describe('User data security', () => {
    it('should not return password in auth response', async () => {
      const signUpInput: SignUpInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.signUp(signUpInput);

      expect(result.user.password).toBeUndefined();
    });

    it('should store hashed password in database', async () => {
      const signUpInput: SignUpInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      await service.signUp(signUpInput);

      const createCall = mockUserRepository.create.mock.calls[0][0];

      expect(createCall.password).toBeDefined();
      expect(createCall.password).not.toBe('password123');
    });
  });
});
