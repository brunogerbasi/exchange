import { render, fireEvent } from '@testing-library/react';
import { OrderGrid } from './OrderGrid';
import * as ordersStore from '../../../stores/useOrdersStore';
import type { Order } from '../../../types/types';

describe('OrderGrid', () => {
  const mockOrders: Order[] = [
    {
      id: 1,
      instrumento: 'PETR4',
      lado: 'Compra',
      preco: 25.5,
      quantidade: 100,
      quantidadeRestante: 100,
      status: 'Aberta',
      dataHora: '2025-05-01T10:00:00.000Z',
      history: [],
    },
    {
      id: 2,
      instrumento: 'VALE3',
      lado: 'Venda',
      preco: 30.0,
      quantidade: 50,
      quantidadeRestante: 50,
      status: 'Aberta',
      dataHora: '2025-05-02T11:00:00.000Z',
      history: [],
    },
  ];

  beforeEach(() => {
    jest.spyOn(ordersStore, 'useOrdersStore').mockImplementation((selector) => {
      const store = {
        orders: mockOrders,
        loading: false,
        error: null,
        fetchOrders: jest.fn(),
        createOrder: jest.fn(),
        updateOrder: jest.fn(),
      };      
      return typeof selector === 'function' ? selector(store) : store;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renderiza duas linhas no grid', () => {
    const { container } = render(<OrderGrid />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(2);
  });

  it('ordena por ID descendente quando selecionado', () => {
    const { getByLabelText, container } = render(<OrderGrid />);    
    fireEvent.change(getByLabelText(/Ordenar ID/i), { target: { value: 'desc' } });    
    const firstCell = container.querySelector('tbody tr:first-child td');
    expect(firstCell?.textContent).toBe('2');
  });

  it('filtra por instrumento corretamente', () => {
    const { getByLabelText, container } = render(<OrderGrid />);    
    fireEvent.change(getByLabelText(/Instrumento/i), { target: { value: 'VALE3' } });
    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(1);    
    const instrumentCell = container.querySelector('tbody tr td:nth-child(2)');
    expect(instrumentCell?.textContent).toBe('VALE3');
  });
});