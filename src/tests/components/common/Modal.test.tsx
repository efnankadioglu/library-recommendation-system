import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '@/components/common/Modal';

describe('Modal Component – full coverage', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.style.overflow = 'unset';
    vi.restoreAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={vi.fn()} title="Hidden">
        Content
      </Modal>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders modal content when isOpen is true', () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('locks body scroll when modal is open', () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Scroll Lock">
        Content
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll on unmount', () => {
    const { unmount } = render(
      <Modal isOpen onClose={vi.fn()} title="Unmount">
        Content
      </Modal>
    );

    unmount();
    expect(document.body.style.overflow).toBe('unset');
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose} title="Backdrop Close">
        Content
      </Modal>
    );

    const backdrop = document.querySelector('.bg-black.bg-opacity-50')!;
    fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose} title="Button Close">
        Content
      </Modal>
    );

    const closeButton = document.querySelector('button')!;
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose} title="Escape Close">
        Content
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose for other keys', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose} title="No Close">
        Content
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Enter' });

    expect(onClose).not.toHaveBeenCalled();
  });
});
