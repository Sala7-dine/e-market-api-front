// eslint-disable-next-line no-unused-vars
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../../components/Pagination";

describe("Pagination Component Tests", () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render pagination with current page", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={false}
      />
    );

    expect(screen.getByText("Précédent")).toBeInTheDocument();
    expect(screen.getByText("Suivant")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("should disable Previous button on first page", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={false}
      />
    );

    const prevButton = screen.getByText("Précédent");
    expect(prevButton).toBeDisabled();
  });

  test("should disable Next button on last page", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={false}
        hasPrev={true}
      />
    );

    const nextButton = screen.getByText("Suivant");
    expect(nextButton).toBeDisabled();
  });

  test("should enable both buttons on middle page", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    const prevButton = screen.getByText("Précédent");
    const nextButton = screen.getByText("Suivant");

    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  test("should call onPageChange when clicking next", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    const nextButton = screen.getByText("Suivant");
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  test("should call onPageChange when clicking previous", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    const prevButton = screen.getByText("Précédent");
    fireEvent.click(prevButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  test("should call onPageChange when clicking page number", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={false}
      />
    );

    const pageButton = screen.getByText("3");
    fireEvent.click(pageButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  test("should highlight current page", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    const currentPageButton = screen.getByText("3");
    expect(currentPageButton).toHaveClass("active");
  });

  test("should not call onPageChange when clicking current page", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    const currentPageButton = screen.getByText("3");
    fireEvent.click(currentPageButton);

    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  test("should render all pages when total is 5 or less", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={false}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("should handle single page", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
        hasNext={false}
        hasPrev={false}
      />
    );

    const prevButton = screen.getByText("Précédent");
    const nextButton = screen.getByText("Suivant");

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("should render limited page numbers for many pages", () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={20}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    // Should render maxVisiblePages (5) around current page
    expect(screen.getByText("10")).toBeInTheDocument();
    const pageButtons = screen.getAllByRole("button");
    // Should have Previous + 5 pages + Next = 7 buttons
    const visiblePageNumbers = pageButtons.filter(
      (btn) => !btn.textContent.includes("Précédent") && !btn.textContent.includes("Suivant")
    );
    expect(visiblePageNumbers.length).toBeLessThanOrEqual(5);
  });

  test("should not call onPageChange for invalid page numbers", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={false}
      />
    );

    const prevButton = screen.getByText("Précédent");
    fireEvent.click(prevButton); // Try to go to page 0

    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  test("should handle string page numbers", () => {
    render(
      <Pagination
        currentPage="3"
        totalPages="5"
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    const currentPageButton = screen.getByText("3");
    expect(currentPageButton).toHaveClass("active");
  });
});
