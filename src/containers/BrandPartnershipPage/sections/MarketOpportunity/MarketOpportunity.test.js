import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import MarketOpportunity from './MarketOpportunity';

// Mock the components
jest.mock('../../../../components', () => ({
  H2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
  H3: ({ children, ...props }) => <h3 {...props}>{children}</h3>
}));

describe('MarketOpportunity', () => {
  it('renders the main title and subtitle', () => {
    render(<MarketOpportunity />);

    expect(screen.getByText('The US Indian Baby Clothing Market Opportunity')).toBeInTheDocument();
    expect(screen.getByText('A massive, underserved market waiting for authentic Indian brands')).toBeInTheDocument();
  });

  it('renders all opportunity cards', () => {
    render(<MarketOpportunity />);

    expect(screen.getByText('The Market Reality')).toBeInTheDocument();
    expect(screen.getByText('Your Current Challenges')).toBeInTheDocument();
    expect(screen.getByText('The Mela Solution')).toBeInTheDocument();
  });

  it('renders correct market data in first card', () => {
    render(<MarketOpportunity />);

    expect(screen.getByText('4.5M Indian Americans')).toBeInTheDocument();
    expect(screen.getByText('$126K median household income (high purchasing power)')).toBeInTheDocument();
    expect(screen.getByText('200K+ Indian babies born in US annually')).toBeInTheDocument();
    expect(screen.getByText('Zero Indian baby clothing specialty retailers serving US market')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(<MarketOpportunity />);

    const prevButton = screen.getByLabelText('Previous opportunity card');
    const nextButton = screen.getByLabelText('Next opportunity card');

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('renders page indicators', () => {
    render(<MarketOpportunity />);

    const indicators = screen.getAllByLabelText(/Go to card \d+/);
    expect(indicators).toHaveLength(3); // Three opportunity cards
  });

  it('navigates to next card when next button is clicked', () => {
    render(<MarketOpportunity />);

    const nextButton = screen.getByLabelText('Next opportunity card');
    fireEvent.click(nextButton);

    expect(screen.getByText('Your Current Challenges')).toBeInTheDocument();
    expect(screen.getByText('High shipping costs')).toBeInTheDocument();
  });

  it('navigates to previous card when prev button is clicked', () => {
    render(<MarketOpportunity />);

    // First go to next card
    const nextButton = screen.getByLabelText('Next opportunity card');
    fireEvent.click(nextButton);

    // Then go back
    const prevButton = screen.getByLabelText('Previous opportunity card');
    fireEvent.click(prevButton);

    expect(screen.getByText('The Market Reality')).toBeInTheDocument();
    expect(screen.getByText('4.5M Indian Americans')).toBeInTheDocument();
  });

  it('disables prev button on first card', () => {
    render(<MarketOpportunity />);

    const prevButton = screen.getByLabelText('Previous opportunity card');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last card', () => {
    render(<MarketOpportunity />);

    const nextButton = screen.getByLabelText('Next opportunity card');

    // Navigate to last card (click next 2 times)
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(screen.getByText('The Mela Solution')).toBeInTheDocument();
    expect(nextButton).toBeDisabled();
  });

  it('allows direct navigation via page indicators', () => {
    render(<MarketOpportunity />);

    const thirdIndicator = screen.getByLabelText('Go to card 3');
    fireEvent.click(thirdIndicator);

    expect(screen.getByText('The Mela Solution')).toBeInTheDocument();
    expect(screen.getByText('We drive qualified traffic to your existing website')).toBeInTheDocument();
  });

  it('renders key stats section', () => {
    render(<MarketOpportunity />);

    expect(screen.getByText('Market Size & Potential')).toBeInTheDocument();
    expect(screen.getByText('4.5M')).toBeInTheDocument();
    expect(screen.getByText('Indian Americans')).toBeInTheDocument();
    expect(screen.getByText('$126K')).toBeInTheDocument();
    expect(screen.getByText('Median Income')).toBeInTheDocument();
    expect(screen.getByText('200K+')).toBeInTheDocument();
    expect(screen.getByText('Babies Annually')).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    render(<MarketOpportunity />);

    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 2 });
    expect(mainHeading).toHaveTextContent('The US Indian Baby Clothing Market Opportunity');

    const subHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(subHeadings.length).toBeGreaterThan(0);
    // Should find the first carousel card heading
    expect(screen.getByText('The Market Reality')).toBeInTheDocument();

    // Check for button accessibility
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('handles keyboard navigation', () => {
    render(<MarketOpportunity />);

    const nextButton = screen.getByLabelText('Next opportunity card');

    // Focus the button and press Enter
    nextButton.focus();
    fireEvent.keyDown(nextButton, { key: 'Enter' });

    expect(screen.getByText('Your Current Challenges')).toBeInTheDocument();
  });
});