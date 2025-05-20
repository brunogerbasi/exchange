import { render, fireEvent } from '@testing-library/react';
import { Filters } from './Filters';

describe('Filters component', () => {
  it('renders all controls and triggers callbacks on change', () => {
    const onDateChange = jest.fn();
    const onInstrumentChange = jest.fn();
    const onSideChange = jest.fn();
    const onStatusChange = jest.fn();
    const onSortChange = jest.fn();

    const { getByLabelText } = render(
      <Filters
        filterDate=""
        filterInstrument=""
        filterSide=""
        filterStatus=""
        sortDirection=""
        instrumentOptions={[ 'PETR4', 'VALE3' ]}
        sideOptions={[ 'Compra', 'Venda' ]}
        statusOptions={[ 'Aberta', 'Parcial' ]}
        onDateChange={onDateChange}
        onInstrumentChange={onInstrumentChange}
        onSideChange={onSideChange}
        onStatusChange={onStatusChange}
        onSortChange={onSortChange}
      />
    );
  
    const sortSelect = getByLabelText(/Ordenar ID/i);
    fireEvent.change(sortSelect, { target: { value: 'asc' } });
    expect(onSortChange).toHaveBeenCalledWith('asc');

    const dateInput = getByLabelText(/Data/i);
    fireEvent.change(dateInput, { target: { value: '2025-05-19' } });
    expect(onDateChange).toHaveBeenCalledWith('2025-05-19');

    const instrSelect = getByLabelText(/Instrumento/i);
    fireEvent.change(instrSelect, { target: { value: 'VALE3' } });
    expect(onInstrumentChange).toHaveBeenCalledWith('VALE3');

    const sideSelect = getByLabelText(/Lado/i);
    fireEvent.change(sideSelect, { target: { value: 'Venda' } });
    expect(onSideChange).toHaveBeenCalledWith('Venda');
    
    const statusSelect = getByLabelText(/Status/i);
    fireEvent.change(statusSelect, { target: { value: 'Parcial' } });
    expect(onStatusChange).toHaveBeenCalledWith('Parcial');
  });
});
