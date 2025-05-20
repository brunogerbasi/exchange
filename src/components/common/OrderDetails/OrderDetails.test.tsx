import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OrderDetails } from './OrderDetails';
import * as ordersStore from '../../../stores/useOrdersStore';
import type { Order } from '../../../types/types';

describe('OrderDetails', () => {
  const updateOrderMock = jest.fn();
  const onCloseMock = jest.fn();
  const baseOrder: Order = {
    id: 1,
    instrumento: 'PETR4',
    lado: 'Compra',
    preco: 20.5,
    quantidade: 100,
    quantidadeRestante: 100,
    status: 'Aberta',
    dataHora: new Date('2025-05-19T22:40:00.000Z').toISOString(),
    history: []
  };

  beforeEach(() => {
    jest
      .spyOn(ordersStore, 'useOrdersStore')
      .mockImplementation(selector => selector({ updateOrder: updateOrderMock } as any));
    updateOrderMock.mockClear();
    onCloseMock.mockClear();
  });

  afterEach(() => jest.restoreAllMocks());

  it('renderiza os campos e botão Salvar desabilitado quando status não muda', () => {
    render(<OrderDetails order={baseOrder} onClose={onCloseMock} />);

    expect(screen.getByText(/Detalhes da Ordem #1/)).toBeInTheDocument();
    expect(screen.getByText('PETR4')).toBeInTheDocument();
    expect(screen.getByText('Compra')).toBeInTheDocument();
    expect(screen.getByText('20.50')).toBeInTheDocument();

    // Salvar deve estar desabilitado pois status ainda é 'Aberta'
    const saveButton = screen.getByRole('button', { name: /Salvar/i });
    expect(saveButton).toBeDisabled();
  });

  it('abre confirmação ao mudar status para Cancelada e clicar em Salvar', async () => {
    render(<OrderDetails order={baseOrder} onClose={onCloseMock} />);
    
    fireEvent.change(screen.getByLabelText(/Status:/), {
      target: { value: 'Cancelada' }
    });
    expect(screen.getByLabelText(/Status:/)).toHaveValue('Cancelada');
    
    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));
    expect(screen.getByText(/Confirmar Cancelamento/)).toBeInTheDocument();
   
    fireEvent.click(screen.getByRole('button', { name: /Não/ }));
    await waitFor(() => {
      expect(screen.queryByText(/Confirmar Cancelamento/)).toBeNull();
      expect(screen.getByLabelText(/Status:/)).toHaveValue('Aberta');
    });
  });

  it('ao confirmar cancelamento chama updateOrder e onClose', async () => {
    render(<OrderDetails order={baseOrder} onClose={onCloseMock} />);

    fireEvent.change(screen.getByLabelText(/Status:/), { target: { value: 'Cancelada' } });
    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));
    
    fireEvent.click(screen.getByRole('button', { name: /Sim, cancelar/i }));

    await waitFor(() => {
      expect(updateOrderMock).toHaveBeenCalledWith(1, 'Cancelada');
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});