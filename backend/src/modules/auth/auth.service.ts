import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { SignUpInput, SignInInput, AuthResponse } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
    const { email, password, name } = signUpInput;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate token
    const payload = { sub: savedUser.id, email: savedUser.email };
    const access_token = this.jwtService.sign(payload);

    // Return user without password
    const { password: _, ...userWithoutPassword } = savedUser;

    return {
      access_token,
      user: userWithoutPassword as User,
    };
  }

  async signIn(signInInput: SignInInput): Promise<AuthResponse> {
    const { email, password } = signInInput;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      access_token,
      user: userWithoutPassword as User,
    };
  }

  async logout(): Promise<{ message: string }> {
    // In a real app, you might invalidate the token here
    return { message: 'Logged out successfully' };
  }
}
