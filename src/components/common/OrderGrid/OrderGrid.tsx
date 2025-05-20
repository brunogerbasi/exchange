import React, { useState, useEffect, useMemo } from 'react';
import './OrderGrid.styles.scss';
import { Filters } from '../Filters/Filters';
import { Pagination } from '../Pagination/Pagination';
import { Modal } from '../../layout/Modal/Modal';
import { CreateOrderForm } from '../CreateOrderForm/CreateOrderForm';
import { OrderDetails } from '../OrderDetails/OrderDetails';
import { OrderHistory } from '../OrderHistory/OrderHistory';
import { useOrdersStore } from '../../../stores/useOrdersStore';
import type { Order } from '../../../types/types';
import { FaEye, FaTimes } from 'react-icons/fa';

export const OrderGrid: React.FC = () => {
  const { orders, loading, error, fetchOrders } = useOrdersStore();
  const updateOrder = useOrdersStore(state => state.updateOrder);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  const [filterDate, setFilterDate] = useState('');
  const [filterInstrument, setFilterInstrument] = useState('');
  const [filterSide, setFilterSide] = useState('');
  const [filterStatus, setFilterStatus] = useState('');  
  const [sortDirection, setSortDirection] = useState<'' | 'asc' | 'desc'>('');

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const instrumentOptions = useMemo(
    () => Array.from(new Set(orders.map(o => o.instrumento))).sort(),
    [orders]
  );
  const sideOptions = useMemo(
    () => Array.from(new Set(orders.map(o => o.lado))).sort(),
    [orders]
  );
  const statusOptions = useMemo(
    () => Array.from(new Set(orders.map(o => o.status))).sort(),
    [orders]
  );

  const filtered = useMemo(
    () => orders.filter(o => {
      const date = o.dataHora.slice(0, 10);
      return (
        (!filterDate || date === filterDate) &&
        (!filterInstrument || o.instrumento === filterInstrument) &&
        (!filterSide || o.lado === filterSide) &&
        (!filterStatus || o.status === filterStatus)
      );
    }),
    [orders, filterDate, filterInstrument, filterSide, filterStatus]
  );

  const sorted = useMemo(() => {
    if (sortDirection === 'asc') {
      return [...filtered].sort((a, b) => a.id - b.id);
    }
    if (sortDirection === 'desc') {
      return [...filtered].sort((a, b) => b.id - a.id);
    }
    return filtered;
  }, [filtered, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));

  const paginated = useMemo(
    () => sorted.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
    [sorted, currentPage]
  );

  const openViewModal = (order: Order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedOrder(null);
  };

  const confirmCancel = (order: Order) => {
    setOrderToCancel(order);
    setIsCancelConfirmOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!orderToCancel) return;
    await updateOrder(orderToCancel.id, 'Cancelada');
    setIsCancelConfirmOpen(false);
    if (selectedOrder?.id === orderToCancel.id) {
      setSelectedOrder({ ...orderToCancel, status: 'Cancelada' });
    }
    setOrderToCancel(null);
  };

  const closeCancelConfirm = () => {
    setIsCancelConfirmOpen(false);
    setOrderToCancel(null);
  };

  return (
    <div className="order-grid-container">
      <button className="open-modal-btn" onClick={() => setIsCreateModalOpen(true)}>
        Adicionar Ordem
      </button>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <CreateOrderForm onSuccess={() => setIsCreateModalOpen(false)} />
      </Modal>

      <Filters
        filterDate={filterDate}
        filterInstrument={filterInstrument}
        filterSide={filterSide}
        filterStatus={filterStatus}
        sortDirection={sortDirection}
        instrumentOptions={instrumentOptions}
        sideOptions={sideOptions}
        statusOptions={statusOptions}
        onDateChange={value => { setFilterDate(value); setCurrentPage(1); }}
        onInstrumentChange={value => { setFilterInstrument(value); setCurrentPage(1); }}
        onSideChange={value => { setFilterSide(value); setCurrentPage(1); }}
        onStatusChange={value => { setFilterStatus(value); setCurrentPage(1); }}
        onSortChange={direction => { setSortDirection(direction); setCurrentPage(1); }}
      />

      {loading && <div className="loading">Carregando ordens…</div>}
      {error && <div className="error">Erro: {error}</div>}

      {!loading && !error && (
        <>
          <div className="grid-wrapper">
            <table className="order-grid">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Instrumento</th>
                  <th>Lado</th>
                  <th>Preço</th>
                  <th>Quantidade</th>
                  <th>Qtd Restante</th>
                  <th>Status</th>
                  <th>Data/Hora</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td className="clickable" onClick={() => openViewModal(order)} title="Visualizar detalhes">
                      {order.instrumento}
                    </td>
                    <td>{order.lado}</td>
                    <td>{order.preco.toFixed(2)}</td>
                    <td>{order.quantidade}</td>
                    <td>{order.quantidadeRestante}</td>
                    <td>{order.status}</td>
                    <td>{new Date(order.dataHora).toLocaleString()}</td>
                    <td className="actions-cell">
                      <button className="icon-button" title="Visualizar" onClick={() => openViewModal(order)}>
                        <FaEye />
                      </button>
                      <button
                        className="icon-button"
                        title="Cancelar"
                        onClick={() => confirmCancel(order)}
                        disabled={!['Aberta', 'Parcial'].includes(order.status)}
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={closeViewModal}>
        {selectedOrder && (
          <>
            <OrderDetails order={selectedOrder} onClose={closeViewModal} />
            <OrderHistory history={selectedOrder.history || []} />
          </>
        )}
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={isCancelConfirmOpen} onClose={closeCancelConfirm}>
        <div className="cancel-confirm">
          <h3>Confirmar Cancelamento</h3>
          <p>Tem certeza que deseja cancelar a ordem?</p>
          <p>Após o cancelamento não será possível modificar o status.</p>
          <div className="confirm-actions">
            <button className="btn-cancel" onClick={closeCancelConfirm}>Não</button>
            <button className="btn-save" onClick={handleCancelConfirm}>Sim, cancelar</button>
          </div>
        </div>
      </Modal>

    </div>
  );
};