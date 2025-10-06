import { render, screen } from "@testing-library/react";
import Loading from "@/components/Loading/Loading";

describe("Loading Component", () => {
  it("should render loading spinner", () => {
    render(<Loading />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should have spinner element", () => {
    const { container } = render(<Loading />);
    const spinner = container.querySelector(".spinner");
    expect(spinner).toBeInTheDocument();
  });

  it("should apply correct CSS classes", () => {
    const { container } = render(<Loading />);
    const loadingContainer = container.firstChild;
    expect(loadingContainer).toHaveClass("container");
  });
});
