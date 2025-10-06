import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
  query GetBooks($pagination: PaginationInput, $filter: FilterInput) {
    books(pagination: $pagination, filter: $filter) {
      books {
        id
        title
        author
        publishedYear
        genre
        description
        isbn
        imageUrl
      }
      total
      page
      limit
      totalPages
      hasNextPage
      hasPreviousPage
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
      imageUrl
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation CreateBook($input: CreateBookInput!, $image: Upload) {
    createBook(input: $input, image: $image) {
      id
      title
      author
      publishedYear
      genre
      description
      isbn
      imageUrl
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: String!, $input: UpdateBookInput!, $image: Upload) {
    updateBook(id: $id, input: $input, image: $image) {
      id
      title
      author
      publishedYear
      genre
      description
      isbn
      imageUrl
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
