import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('desabilita botão anterior na primeira página e próxima na última', () => {
    const onPageChange = jest.fn();
    const { rerender } = render(
      <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />
    );

    const prev = screen.getByLabelText(/Página anterior/i);
    const next = screen.getByLabelText(/Próxima página/i);
    expect(prev).toBeDisabled();
    expect(next).toBeEnabled();
    
    fireEvent.click(next);
    expect(onPageChange).toHaveBeenCalledWith(2);
    
    rerender(<Pagination currentPage={3} totalPages={3} onPageChange={onPageChange} />);
    expect(screen.getByLabelText(/Próxima página/i)).toBeDisabled();
  });

  it('renderiza botões de páginas e destaca a atual', () => {
    const onPageChange = jest.fn();
    render(<Pagination currentPage={2} totalPages={4} onPageChange={onPageChange} />);

    const pages = screen.getAllByRole('button').filter(btn => !['‹','›'].includes(btn.textContent || ''));
    
    expect(pages).toHaveLength(4);
    
    const btn2 = pages.find(btn => btn.textContent === '2');
    expect(btn2).toHaveClass('active');
    expect(btn2).toHaveAttribute('aria-current', 'page');

    const btn4 = pages.find(btn => btn.textContent === '4');
    fireEvent.click(btn4!);
    expect(onPageChange).toHaveBeenCalledWith(4);
  });
});
