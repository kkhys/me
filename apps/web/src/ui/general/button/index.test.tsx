import { fireEvent, render, screen } from '@testing-library/react';

import { Button } from '.';

describe('Button', () => {
  it('should render a button element with the correct class when asChild is true', () => {
    const text = 'test';
    render(
      <Button asChild>
        <a href='/'>{text}</a>
      </Button>,
    );
    const button = screen.getByText(text);
    expect(button.tagName).toBe('A');
  });

  it('should fire an onClick event when the button is clicked', () => {
    const onClickMock = jest.fn();
    render(<Button onClick={onClickMock} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
