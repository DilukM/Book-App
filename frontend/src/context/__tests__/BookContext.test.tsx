import { renderHook } from "@testing-library/react";
import { BookProvider, useBooks } from "@/context/BookContext";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

// Mock Apollo Client
const mockClient = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: "no-cache" },
    query: { fetchPolicy: "no-cache" },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={mockClient}>
    <BookProvider>{children}</BookProvider>
  </ApolloProvider>
);

describe("BookContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with null booksData", () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    expect(result.current.booksData).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it("should provide fetchBooks function", () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    expect(result.current.fetchBooks).toBeDefined();
    expect(typeof result.current.fetchBooks).toBe("function");
  });

  it("should provide getBookById function", () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    expect(result.current.getBookById).toBeDefined();
    expect(typeof result.current.getBookById).toBe("function");
  });

  it("should provide addBook function", () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    expect(result.current.addBook).toBeDefined();
    expect(typeof result.current.addBook).toBe("function");
  });

  it("should provide updateBook function", () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    expect(result.current.updateBook).toBeDefined();
    expect(typeof result.current.updateBook).toBe("function");
  });

  it("should provide deleteBook function", () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    expect(result.current.deleteBook).toBeDefined();
    expect(typeof result.current.deleteBook).toBe("function");
  });

  it("should provide error property", () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    expect(result.current.error).toBeUndefined();
  });
});
