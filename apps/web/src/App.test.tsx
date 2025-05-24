import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Basic test to ensure the app renders
    expect(document.body).toBeDefined();
  });
});
