import { render, fireEvent, waitFor } from '@testing-library/react';
import { CreateOrderForm } from './CreateOrderForm';
import * as ordersStore from '../../../stores/useOrdersStore';

describe('CreateOrderForm', () => {
  const createOrderMock = jest.fn();
  const onSuccessMock = jest.fn();

  beforeEach(() => {    
    jest.spyOn(ordersStore, 'useOrdersStore').mockImplementation(
      selector => selector({ createOrder: createOrderMock } as any)
    );
    createOrderMock.mockClear();
    onSuccessMock.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renderiza campos e botão desabilitado inicialmente', () => {
    const { getByLabelText, getByRole } = render(
      <CreateOrderForm onSuccess={onSuccessMock} />
    );

    expect(getByLabelText(/Instrumento/i)).toBeInTheDocument();
    expect(getByLabelText(/Lado/i)).toBeInTheDocument();
    expect(getByLabelText(/Preço/i)).toBeInTheDocument();
    expect(getByLabelText(/Quantidade/i)).toBeInTheDocument();

    expect(getByRole('button', { name: /Salvar Ordem/i })).toBeDisabled();
  });

  it('habilita o botão quando o formulário é válido', async () => {
    const { getByLabelText, getByRole, queryByText } = render(
      <CreateOrderForm onSuccess={onSuccessMock} />
    );

    const instrumento = getByLabelText(/Instrumento/i);
    const preco = getByLabelText(/Preço/i);
    const quantidade = getByLabelText(/Quantidade/i);
    const submit = getByRole('button', { name: /Salvar Ordem/i });

    fireEvent.change(instrumento, { target: { value: 'PETR4' } });
    fireEvent.change(preco,       { target: { value: '10.50' } });
    fireEvent.change(quantidade,  { target: { value: '100' } });

    await waitFor(() => {
      expect(queryByText(/é obrigatório\./i)).toBeNull();
      expect(submit).toBeEnabled();
    });
  });

  it('chama createOrder e onSuccess no submit', async () => {
    const { getByLabelText, getByRole } = render(
      <CreateOrderForm onSuccess={onSuccessMock} />
    );

    fireEvent.change(getByLabelText(/Instrumento/i), { target: { value: 'VALE3' } });
    fireEvent.change(getByLabelText(/Preço/i),       { target: { value: '20.00' } });
    fireEvent.change(getByLabelText(/Quantidade/i),  { target: { value: '50' } });

    const submit = getByRole('button', { name: /Salvar Ordem/i });
    fireEvent.click(submit);

    await waitFor(() => {
      expect(createOrderMock).toHaveBeenCalledWith({
        instrumento: 'VALE3',
        lado: 'Compra',
        preco: 20.0,
        quantidade: 50,
      });
      expect(onSuccessMock).toHaveBeenCalled();
    });
  });
});