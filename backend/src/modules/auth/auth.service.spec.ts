import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { SignUpInput, SignInInput } from './auth.types';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Clear users after each test
    service['users'].clear();
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

      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.signUp(signUpInput);

      expect(result).toBeDefined();
      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.name).toBe('Test User');
      expect(result.user.password).toBeUndefined();
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: expect.any(String),
        email: 'test@example.com',
      });
    });

    it('should hash the password', async () => {
      const signUpInput: SignUpInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      await service.signUp(signUpInput);

      const users = Array.from(service['users'].values());
      const hashedPassword = users[0].password;

      expect(hashedPassword).not.toBe('password123');
      expect(hashedPassword).toBeDefined();
      const isMatch = await bcrypt.compare('password123', hashedPassword!);
      expect(isMatch).toBe(true);
    });

    it('should throw ConflictException when user already exists', async () => {
      const signUpInput: SignUpInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      await service.signUp(signUpInput);

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

      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result1 = await service.signUp(signUpInput1);
      const result2 = await service.signUp(signUpInput2);

      expect(result1.user.id).not.toBe(result2.user.id);
    });
  });

  describe('signIn', () => {
    beforeEach(async () => {
      // Create a test user
      const signUpInput: SignUpInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      mockJwtService.sign.mockReturnValue('mock-jwt-token');
      await service.signUp(signUpInput);
      jest.clearAllMocks();
    });

    it('should successfully sign in with correct credentials', async () => {
      const signInInput: SignInInput = {
        email: 'test@example.com',
        password: 'password123',
      };

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

      let capturedPayload: any;
      mockJwtService.sign.mockImplementation((payload) => {
        capturedPayload = payload;
        return 'mock-jwt-token';
      });

      await service.signUp(signUpInput);

      expect(capturedPayload).toBeDefined();
      expect(capturedPayload.sub).toBeDefined();
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

      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.signUp(signUpInput);

      expect(result.user.password).toBeUndefined();
    });

    it('should store hashed password in users map', async () => {
      const signUpInput: SignUpInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      await service.signUp(signUpInput);

      const users = Array.from(service['users'].values());
      const storedUser = users[0];

      expect(storedUser.password).toBeDefined();
      expect(storedUser.password).not.toBe('password123');
    });
  });
});
