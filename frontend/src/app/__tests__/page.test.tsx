import { render } from "@testing-library/react";
import Home from "@/app/page";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
}));

// Mock useAuth hook
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(() => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  })),
}));

// Mock useBooks hook
jest.mock("@/context/BookContext", () => ({
  useBooks: jest.fn(() => ({
    books: [],
    isLoading: false,
    getBooks: jest.fn(),
    addBook: jest.fn(),
    updateBook: jest.fn(),
    deleteBook: jest.fn(),
    searchBooks: jest.fn(() => []),
  })),
}));

describe("Home Page Integration", () => {
  it("should render without crashing", () => {
    const { container } = render(<Home />);
    expect(container).toBeInTheDocument();
  });

  it("should render hero section", () => {
    const { container } = render(<Home />);
    const hero = container.querySelector(".hero");
    expect(hero).toBeInTheDocument();
  });

  it("should have features section", () => {
    const { getByText } = render(<Home />);
    expect(getByText("Features")).toBeInTheDocument();
  });
});
