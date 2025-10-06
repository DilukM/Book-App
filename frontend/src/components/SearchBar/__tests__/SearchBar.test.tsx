import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "@/components/SearchBar/SearchBar";

describe("SearchBar Component", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render search input", () => {
    render(<SearchBar value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText(/search books/i);
    expect(input).toBeInTheDocument();
  });

  it("should call onChange when typing in search input", async () => {
    const user = userEvent.setup();
    render(<SearchBar value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText(/search books/i);
    await user.type(input, "t");

    expect(mockOnChange).toHaveBeenCalled();
  });

  it("should display the provided value", () => {
    render(<SearchBar value="initial search" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText(
      /search books/i
    ) as HTMLInputElement;
    expect(input.value).toBe("initial search");
  });

  it("should use custom placeholder when provided", () => {
    render(
      <SearchBar
        value=""
        onChange={mockOnChange}
        placeholder="Custom placeholder"
      />
    );

    expect(
      screen.getByPlaceholderText("Custom placeholder")
    ).toBeInTheDocument();
  });

  it("should handle value changes", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<SearchBar value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText(
      /search books/i
    ) as HTMLInputElement;
    await user.type(input, "test");

    expect(mockOnChange).toHaveBeenCalledTimes(4); // Called once for each character
  });
});
