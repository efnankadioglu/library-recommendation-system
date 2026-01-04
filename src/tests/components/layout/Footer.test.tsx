import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';

describe('Footer', () => {
  it('renders brand name and copyright text', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText('LibraryAI')).toBeInTheDocument();

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} LibraryAI. All rights reserved.`)
    ).toBeInTheDocument();
  });

  it('renders footer navigation links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about'
    );
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'href',
      '/privacy'
    );
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute(
      'href',
      '/terms'
    );
  });

  it('renders social media icon links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // Social icons are anchor tags with href="#"
    const socialLinks = screen.getAllByRole('link', { hidden: true }).filter(
      (link) => link.getAttribute('href') === '#'
    );

    expect(socialLinks).toHaveLength(3);
  });
});
