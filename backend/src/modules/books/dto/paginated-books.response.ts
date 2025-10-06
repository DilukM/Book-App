import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Book } from '../book.entity';

@ObjectType()
export class PaginatedBooksResponse {
  @Field(() => [Book])
  books: Book[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Boolean)
  hasPreviousPage: boolean;
}
