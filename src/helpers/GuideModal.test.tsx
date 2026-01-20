import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GuideModal from './GuideModal';

// Mock flowbite-react Modal components
vi.mock('flowbite-react', () => ({
  Modal: ({ children, show }: any) => {
    if (!show) return null;
    return (
      <div data-testid="modal" role="dialog">
        <div data-testid="modal-content">{children}</div>
      </div>
    );
  },
  ModalHeader: ({ children }: any) => (
    <div data-testid="modal-header">{children}</div>
  ),
  ModalBody: ({ children }: any) => (
    <div data-testid="modal-body">{children}</div>
  ),
  ModalFooter: ({ children }: any) => (
    <div data-testid="modal-footer">{children}</div>
  )
}));

describe('GuideModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render when show is true', () => {
    render(<GuideModal show={true} onClose={vi.fn()} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-header')).toHaveTextContent('How to Play');
  });

  it('should not render when show is false', () => {
    render(<GuideModal show={false} onClose={vi.fn()} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();

    render(<GuideModal show={true} onClose={mockOnClose} />);

    const closeButton = screen.getByText('Got it!');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should display game instructions', () => {
    render(<GuideModal show={true} onClose={vi.fn()} />);

    expect(screen.getByText('Objective')).toBeInTheDocument();
    expect(screen.getAllByText('How to Play').length).toBeGreaterThan(0);
    expect(screen.getByText('Tips')).toBeInTheDocument();
    expect(screen.getByText(/Drag and Drop/)).toBeInTheDocument();
  });
});
