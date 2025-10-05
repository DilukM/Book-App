import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';
import { SignUpInput, SignInInput, AuthResponse } from './auth.types';

@Injectable()
export class AuthService {
  private users = new Map<string, User>();

  constructor(private jwtService: JwtService) {}

  async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
    const { email, password, name } = signUpInput;

    // Check if user exists
    const existingUser = Array.from(this.users.values()).find(u => u.email === email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user: User = {
      id: uuidv4(),
      email,
      name,
      password: hashedPassword,
    };

    this.users.set(user.id, user);

    // Generate token
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: { ...user, password: undefined }, // Don't return password
    };
  }

  async signIn(signInInput: SignInInput): Promise<AuthResponse> {
    const { email, password } = signInInput;

    const user = Array.from(this.users.values()).find(u => u.email === email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: { ...user, password: undefined },
    };
  }

  async logout(): Promise<{ message: string }> {
    // In a real app, you might invalidate the token here
    return { message: 'Logged out successfully' };
  }
}