import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Book {
  @Field()
  id: string;

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