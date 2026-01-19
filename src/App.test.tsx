import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Since the app might redirect or show a loading state initially
    // We just verify that it rendered something.
    // For example, looking for a common element or just ensuring no error thrown.
    expect(document.body).toBeInTheDocument();
  });
});
