import { render, screen } from "@testing-library/react";
import Header from "@/components/Header/Header";
import { useAuth } from "@/context/AuthContext";

// Mock useAuth hook
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock Next.js usePathname
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderWithAuth = (user: any = null, isAuthenticated = false) => {
  mockUseAuth.mockReturnValue({
    user,
    isAuthenticated,
    isLoading: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  });

  return render(<Header />);
};

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the logo and app name", () => {
    renderWithAuth();
    expect(screen.getByText("BookHub")).toBeInTheDocument();
  });

  it("should show login and register links when user is not logged in", () => {
    renderWithAuth(null, false);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  it("should show Books and Logout links when user is logged in", () => {
    const mockUser = { id: "1", name: "Test User", email: "test@example.com" };
    renderWithAuth(mockUser, true);

    expect(screen.getByText("Books")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  it("should display user name when logged in", () => {
    const mockUser = { id: "1", name: "John Doe", email: "john@example.com" };
    renderWithAuth(mockUser, true);

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });
});
