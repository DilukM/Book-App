import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@InputType()
export class SignUpInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  name: string;
}

@InputType()
export class SignInInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class LogoutResponse {
  @Field()
  message: string;
}