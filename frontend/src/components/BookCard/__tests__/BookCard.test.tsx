import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookCard from "@/components/BookCard/BookCard";
import { Book } from "@/types";

const mockBook: Book = {
  id: "1",
  title: "Test Book",
  author: "Test Author",
  genre: "Fiction",
  publishedYear: 2024,
  isbn: "1234567890",
  description: "A test book description",
  imageUrl: "https://example.com/cover.jpg",
};

const mockOnDelete = jest.fn();

describe("BookCard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render book details", () => {
    render(<BookCard book={mockBook} onDelete={mockOnDelete} />);

    expect(screen.getByText("Test Book")).toBeInTheDocument();
    expect(screen.getByText(/Test Author/i)).toBeInTheDocument();
    expect(screen.getByText("Fiction")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("should display book cover image", () => {
    render(<BookCard book={mockBook} onDelete={mockOnDelete} />);

    const image = screen.getByAltText("Test Book");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/cover.jpg");
  });

  it("should not display image when no image is provided", () => {
    const bookWithoutImage = { ...mockBook, imageUrl: undefined };
    render(<BookCard book={bookWithoutImage} onDelete={mockOnDelete} />);

    const image = screen.queryByAltText("Test Book");
    expect(image).not.toBeInTheDocument();
  });

  it("should render edit link", () => {
    render(<BookCard book={mockBook} onDelete={mockOnDelete} />);

    const editLink = screen.getByRole("link", { name: /edit/i });
    expect(editLink).toBeInTheDocument();
    expect(editLink).toHaveAttribute("href", "/books/1/edit");
  });

  it("should call onDelete when delete button is clicked and confirmed", async () => {
    // Mock window.confirm
    global.confirm = jest.fn(() => true);

    const user = userEvent.setup();
    render(<BookCard book={mockBook} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);

    expect(global.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete "Test Book"?'
    );
    expect(mockOnDelete).toHaveBeenCalledWith(mockBook.id);
  });

  it("should display description when provided", () => {
    render(<BookCard book={mockBook} onDelete={mockOnDelete} />);

    expect(screen.getByText("A test book description")).toBeInTheDocument();
  });

  it("should render view details link", () => {
    render(<BookCard book={mockBook} onDelete={mockOnDelete} />);

    const viewLink = screen.getByRole("link", { name: /view details/i });
    expect(viewLink).toBeInTheDocument();
    expect(viewLink).toHaveAttribute("href", "/books/1");
  });

  it("should not render delete button when onDelete is not provided", () => {
    render(<BookCard book={mockBook} />);

    const deleteButton = screen.queryByRole("button", { name: /delete/i });
    expect(deleteButton).not.toBeInTheDocument();
  });

  it("should truncate long descriptions", () => {
    const longDescription = "A".repeat(150);
    const bookWithLongDesc = { ...mockBook, description: longDescription };

    render(<BookCard book={bookWithLongDesc} onDelete={mockOnDelete} />);

    const truncatedText = screen.getByText(/A{120}\.\.\./);
    expect(truncatedText).toBeInTheDocument();
  });
});
