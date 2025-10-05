import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput, SignInInput, AuthResponse, LogoutResponse } from './auth.types';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => String)
  async hello(): Promise<string> {
    return 'Hello from Auth API';
  }

  @Mutation(() => AuthResponse)
  async signUp(@Args('input') signUpInput: SignUpInput): Promise<AuthResponse> {
    return this.authService.signUp(signUpInput);
  }

  @Mutation(() => AuthResponse)
  async signIn(@Args('input') signInInput: SignInInput): Promise<AuthResponse> {
    return this.authService.signIn(signInInput);
  }

  @Mutation(() => LogoutResponse)
  async logout(): Promise<LogoutResponse> {
    return this.authService.logout();
  }
}