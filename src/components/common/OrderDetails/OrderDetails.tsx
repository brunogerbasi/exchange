import React, { useState } from 'react';
import type { Order } from '../../../types/types';
import './OrderDetails.styles.scss';
import { useOrdersStore } from '../../../stores/useOrdersStore';
import { Modal } from '../../layout/Modal/Modal';

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose }) => {
  const updateOrder = useOrdersStore(state => state.updateOrder);
  const [status, setStatus] = useState<Order['status']>(order.status);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isCanceled = order.status === 'Cancelada';
  const statusChangedToCancel = status === 'Cancelada' && order.status !== 'Cancelada';

  const handleSave = async () => {
    if (status === order.status) {
      onClose();
      return;
    }
    if (statusChangedToCancel) {
      setShowConfirm(true);
      return;
    }
    setSaving(true);
    await updateOrder(order.id, status);
    setSaving(false);
    onClose();
  };

  const confirmCancel = async () => {
    setShowConfirm(false);
    setSaving(true);
    await updateOrder(order.id, status);
    setSaving(false);
    onClose();
  };

  const cancelConfirm = () => {
    setShowConfirm(false);
    setStatus(order.status);
  };

  return (
    <>
      <div className="order-details">
        <h2>Detalhes da Ordem #{order.id}</h2>

        <div className="detail-field">
          <span className="label">Instrumento:</span>
          <span className="value">{order.instrumento}</span>
        </div>

        <div className="detail-field">
          <span className="label">Lado:</span>
          <span className="value">{order.lado}</span>
        </div>

        <div className="detail-field">
          <span className="label">Preço:</span>
          <span className="value">{order.preco.toFixed(2)}</span>
        </div>

        <div className="detail-field">
          <span className="label">Quantidade:</span>
          <span className="value">{order.quantidade}</span>
        </div>

        <div className="detail-field">
          <span className="label">Quantidade Restante:</span>
          <span className="value">{order.quantidadeRestante}</span>
        </div>

        <div className="detail-field">
          <label htmlFor="status-select" className="label">Status:</label>
          <select
            id="status-select"
            className="status-select"
            value={status}
            onChange={e => setStatus(e.target.value as Order['status'])}
            disabled={isCanceled || saving}
          >
            <option value="Aberta">Aberta</option>
            <option value="Parcial">Parcial</option>
            <option value="Fechada">Fechada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        <div className="detail-field">
          <span className="label">Data/Hora:</span>
          <span className="value">{new Date(order.dataHora).toLocaleString()}</span>
        </div>

        <div className="detail-actions">
          <button onClick={onClose} disabled={saving} className="btn-cancel">
            Fechar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || isCanceled || status === order.status}
            className="btn-save"
          >
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>

      <Modal isOpen={showConfirm} onClose={cancelConfirm}>
        <div className="cancel-confirm">
          <h3>Confirmar Cancelamento</h3>
          <p>Tem certeza que deseja cancelar a ordem?</p>
          <p>Após o cancelamento não será possível modificar o status.</p>
          <div className="confirm-actions">
            <button className="btn-cancel" onClick={cancelConfirm}>Não</button>
            <button className="btn-save" onClick={confirmCancel}>Sim, cancelar</button>
          </div>
        </div>
      </Modal>
    </>
  );
};
