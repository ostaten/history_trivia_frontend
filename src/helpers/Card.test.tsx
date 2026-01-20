import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './Card';
import type { LandmarkDataStructure } from '../api/generated/models';

// Mock useSortable
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    isDragging: false
  })
}));

describe('Card', () => {
  const mockLandmark: LandmarkDataStructure = {
    id: 1,
    pointOfOccurence: '2020-01-01',
    fullDescription: 'Test event description',
    hintDescription: 'Test hint',
    isConfirmed: false,
    isMoved: false
  };

  it('should render unconfirmed card with full description', () => {
    render(
      <Card
        landmark={mockLandmark}
        confirmPlacement={vi.fn()}
        flashState={undefined}
      />
    );

    expect(screen.getByText('Test event description')).toBeInTheDocument();
  });

  it('should render confirmed card with date and hint', () => {
    const confirmedLandmark = {
      ...mockLandmark,
      isConfirmed: true
    };

    render(
      <Card
        landmark={confirmedLandmark}
        confirmPlacement={vi.fn()}
        flashState={undefined}
      />
    );

    expect(screen.getByText('2020-01-01')).toBeInTheDocument();
    expect(screen.getByText('Test hint')).toBeInTheDocument();
  });

  it('should hide date when hideDate is true', () => {
    const confirmedLandmark = {
      ...mockLandmark,
      isConfirmed: true
    };

    render(
      <Card
        landmark={confirmedLandmark}
        confirmPlacement={vi.fn()}
        flashState={undefined}
        hideDate={true}
      />
    );

    expect(screen.queryByText('2020-01-01')).not.toBeInTheDocument();
    expect(screen.getByText('Test hint')).toBeInTheDocument();
  });

  it('should show confirm button when moved but not confirmed', () => {
    const movedLandmark = {
      ...mockLandmark,
      isMoved: true
    };

    const mockConfirm = vi.fn();
    render(
      <Card
        landmark={movedLandmark}
        confirmPlacement={mockConfirm}
        flashState={undefined}
      />
    );

    const confirmButton = screen.getByText('Tap to Confirm Placement');
    expect(confirmButton).toBeInTheDocument();
  });
});
