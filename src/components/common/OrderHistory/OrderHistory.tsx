import React from 'react';
import type { HistoryEntry } from '../../../types/types';
import './OrderHistory.styles.scss';

interface OrderHistoryProps {
  history: HistoryEntry[];
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ history }) => (
  <div className="order-history">
    <h3>Histórico de Status</h3>
    <table className="order-history__table">
      <thead>
        <tr>
          <th>Status</th>
          <th>Data/Hora</th>
        </tr>
      </thead>
      <tbody>
        {history.length > 0 ? (
          history.map((entry, idx) => (
            <tr key={idx}>
              <td>{entry.status}</td>
              <td>{new Date(entry.timestamp).toLocaleString()}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={2}>Nenhum histórico disponível.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);