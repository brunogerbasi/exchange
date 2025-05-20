
import type { ChangeEvent } from 'react';
import './Filters.styles.scss';

interface FiltersProps {
  filterDate: string;
  filterInstrument: string;
  filterSide: string;
  filterStatus: string;
  sortDirection: '' | 'asc' | 'desc';
  instrumentOptions: string[];
  sideOptions: string[];
  statusOptions: string[];
  onDateChange: (value: string) => void;
  onInstrumentChange: (value: string) => void;
  onSideChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (direction: '' | 'asc' | 'desc') => void;
}

export const Filters: React.FC<FiltersProps> = ({
  filterDate,
  filterInstrument,
  filterSide,
  filterStatus,
  sortDirection,
  instrumentOptions,
  sideOptions,
  statusOptions,
  onDateChange,
  onInstrumentChange,
  onSideChange,
  onStatusChange,
  onSortChange,
}) => (
  <div className="filters-container">
    <div className="filters">

      <label>
        Ordenar ID
        <select
          value={sortDirection}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onSortChange(e.target.value as any)}
        >
          <option value="">Nenhum</option>
          <option value="asc">ID ↑</option>
          <option value="desc">ID ↓</option>
        </select>
      </label>

      <label>
        Data
        <input
          type="date"
          value={filterDate}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onDateChange(e.target.value)}
        />
      </label>

      <label>
        Instrumento
        <select
          value={filterInstrument}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onInstrumentChange(e.target.value)}
        >
          <option value="">Todos</option>
          {instrumentOptions.map(instr => (
            <option key={instr} value={instr}>{instr}</option>
          ))}
        </select>
      </label>

      <label>
        Lado
        <select
          value={filterSide}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onSideChange(e.target.value)}
        >
          <option value="">Todos</option>
          {sideOptions.map(side => (
            <option key={side} value={side}>{side}</option>
          ))}
        </select>
      </label>

      <label>
        Status
        <select
          value={filterStatus}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onStatusChange(e.target.value)}
        >
          <option value="">Todos</option>
          {statusOptions.map(stat => (
            <option key={stat} value={stat}>{stat}</option>
          ))}
        </select>
      </label>

    </div>
  </div>
);