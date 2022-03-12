import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('App is rendering', () => {
    render(<App />);
    expect(screen.getByText(/Создать лобби/i)).toBeInTheDocument();
  });
});
