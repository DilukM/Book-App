import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Book } from './book.entity';

@InputType()
export class CreateBookInput {
  @Field()
  title: string;

  @Field()
  author: string;

  @Field()
  publishedYear: number;

  @Field()
  genre: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  isbn?: string;
}

@InputType()
export class UpdateBookInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  author?: string;

  @Field({ nullable: true })
  publishedYear?: number;

  @Field({ nullable: true })
  genre?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  isbn?: string;
}

@ObjectType()
export class BooksResponse {
  @Field(() => [Book])
  books: Book[];

  @Field()
  total: number;
}

@ObjectType()
export class DeleteBookResponse {
  @Field()
  message: string;
}