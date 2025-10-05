import { gql } from '@apollo/client';

export const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      author
      publishedYear
      genre
      description
      isbn
    }
  }
`;

export const GET_BOOK = gql`
  query GetBook($id: String!) {
    book(id: $id) {
      id
      title
      author
      publishedYear
      genre
      description
      isbn
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation CreateBook($input: CreateBookInput!) {
    createBook(input: $input) {
      id
      title
      author
      publishedYear
      genre
      description
      isbn
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: String!, $input: UpdateBookInput!) {
    updateBook(id: $id, input: $input) {
      id
      title
      author
      publishedYear
      genre
      description
      isbn
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: String!) {
    deleteBook(id: $id) {
      message
    }
  }
`;