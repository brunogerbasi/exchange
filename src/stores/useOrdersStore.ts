
import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order } from '../types/types';
import {
  fetchOrders as apiFetch,
  createOrder as apiCreate,
  updateOrder as apiUpdate,
} from '../services/ordersMock';

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  createOrder: (
    data: Omit<
      Order,
      'id' | 'status' | 'dataHora' | 'quantidadeRestante' | 'history'
    >
  ) => Promise<void>;
  updateOrder: (id: number, status: Order['status']) => Promise<void>;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, ) => ({
      orders: [],
      loading: false,
      error: null,

      fetchOrders: async () => {
        set({ loading: true, error: null });
        try {
          const data = await apiFetch();
          set({ orders: data, loading: false });
        } catch (err: any) {
          set({ error: err.message || 'Erro ao carregar ordens', loading: false });
        }
      },

      createOrder: async (data) => {
        set({ loading: true });
        try {
          const newOrder = await apiCreate(data);
          set((state) => ({ orders: [newOrder, ...state.orders], loading: false }));
        } catch (err: any) {
          set({ error: err.message || 'Erro ao criar ordem', loading: false });
        }
      },

      updateOrder: async (id, status) => {
        set({ loading: true });
        try {
          const updated = await apiUpdate(id, { status });
          set((state) => ({
            orders: state.orders.map((o) =>
              o.id === id
                ? {
                    ...updated,
                    history: [
                      ...(o.history ?? []),
                      { status: updated.status, timestamp: new Date().toISOString() },
                    ],
                  }
                : o
            ),
            loading: false,
          }));
        } catch (err: any) {
          set({ error: err.message || 'Erro ao atualizar ordem', loading: false });
        }
      },
    }),
    {
      name: 'orders-storage',
    }
  )
);

