import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
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

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.localStorage = localStorageMock as any;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={mockClient}>
    <AuthProvider>{children}</AuthProvider>
  </ApolloProvider>
);

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("should initialize with no user when localStorage is empty", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("should initialize loading state", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Initially loading should become false after mount
    expect(result.current.isLoading).toBe(false);
  });

  it("should provide login function", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.login).toBeDefined();
    expect(typeof result.current.login).toBe("function");
  });

  it("should provide register function", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.register).toBeDefined();
    expect(typeof result.current.register).toBe("function");
  });

  it("should provide logout function", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.logout).toBeDefined();
    expect(typeof result.current.logout).toBe("function");
  });

  it("should handle logout", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Call logout
    await act(async () => {
      await result.current.logout();
    });

    // After logout, user should be null
    expect(result.current.user).toBeNull();
  });
});
