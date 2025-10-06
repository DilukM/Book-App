import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer/Footer";

describe("Footer Component", () => {
  it("should render footer text", () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`${currentYear}`, "i"))
    ).toBeInTheDocument();
  });

  it("should render BookHub branding", () => {
    render(<Footer />);

    const bookHubElements = screen.getAllByText(/BookHub/i);
    expect(bookHubElements.length).toBeGreaterThan(0);
  });

  it("should render Quick Links section", () => {
    render(<Footer />);

    expect(screen.getByText(/Quick Links/i)).toBeInTheDocument();
  });

  it("should render navigation links", () => {
    render(<Footer />);

    // Check for common footer links
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
  });

  it("should have correct footer structure", () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });
});
