import { render, screen } from '@testing-library/react';
import { OrderHistory } from './OrderHistory';
import type { HistoryEntry } from '../../../types/types';

describe('OrderHistory', () => {
  it('exibe mensagem quando histórico vazio', () => {
    render(<OrderHistory history={[]} />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Histórico de Status');
    expect(screen.getByText('Nenhum histórico disponível.')).toBeInTheDocument();
  });

  it('renderiza entradas de histórico corretamente', () => {
    const history: HistoryEntry[] = [
      { status: 'Aberta', timestamp: '2025-05-19T10:00:00.000Z' },
      { status: 'Parcial', timestamp: '2025-05-19T12:30:00.000Z' },
    ];
    render(<OrderHistory history={history} />);

    const rows = screen.getAllByRole('row');    
    expect(rows).toHaveLength(1 + history.length);
    
    history.forEach(entry => {      
      expect(screen.getByText(entry.status)).toBeInTheDocument();      
      const formatted = new Date(entry.timestamp).toLocaleString();
      expect(screen.getByText(formatted)).toBeInTheDocument();
    });
  });
});