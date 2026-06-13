import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import App from './App';

describe('App', () => {
  it('renders the clinic landing page', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /your smile/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /book an appointment/i })).toBeInTheDocument();
  });

  it('switches patient information tabs', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('tab', { name: /payment options/i }));

    expect(screen.getByText(/credit\/debit cards/i)).toBeInTheDocument();
  });

  it('shows appointment validation errors before submitting', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /request appointment/i }));

    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
    expect(screen.getByText(/preferred date is required/i)).toBeInTheDocument();
    expect(screen.getByText(/preferred time is required/i)).toBeInTheDocument();
    expect(screen.getByText(/service is required/i)).toBeInTheDocument();
  });
});
