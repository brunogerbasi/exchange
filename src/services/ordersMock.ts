// src/services/ordersMock.ts
import type { Order } from '../types/types';

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const instruments = [
  'PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'ABEV3',
  'BBAS3', 'MGLU3', 'GGBR4', 'SUZB3', 'RENT3'
];

const statuses: Order['status'][] = ['Aberta', 'Parcial', 'Fechada', 'Cancelada'];
const sides: Order['lado'][] = ['Compra', 'Venda'];

let orders: Order[] = Array.from({ length: 50 }, (_, i) => {
  const quantidade = Math.floor(Math.random() * 90) + 10;
  const quantidadeRestante = Math.floor(Math.random() * quantidade);
  const preco = parseFloat((Math.random() * 100).toFixed(2));
  const timestamp = Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30);

  return {
    id: i + 1,
    instrumento: instruments[i % instruments.length],
    lado: sides[Math.floor(Math.random() * sides.length)],
    preco,
    quantidade,
    quantidadeRestante,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    dataHora: new Date(timestamp).toISOString(),
    history: []
  };
});

// Matching engine
function matchOrders(incoming: Order) {
  const oppositeSide: Order['lado'] = incoming.lado === 'Compra' ? 'Venda' : 'Compra';
  
  const candidates = orders
    .filter(o =>
      o.lado === oppositeSide &&
      (o.status === 'Aberta' || o.status === 'Parcial') &&
      (incoming.lado === 'Compra' ? o.preco <= incoming.preco : o.preco >= incoming.preco)
    )
    .sort((a, b) =>
      incoming.lado === 'Compra'
        ? a.preco - b.preco || a.id - b.id
        : b.preco - a.preco || a.id - b.id
    );

  let qtyToFill = incoming.quantidadeRestante;
  for (const opp of candidates) {
    if (qtyToFill <= 0) break;
    const traded = Math.min(qtyToFill, opp.quantidadeRestante);
    
    opp.quantidadeRestante -= traded;
    incoming.quantidadeRestante -= traded;
    qtyToFill -= traded;
    
    const newStatusOpp: Order['status'] = opp.quantidadeRestante === 0 ? 'Fechada' : 'Parcial';
    const newStatusIncoming: Order['status'] = incoming.quantidadeRestante === 0 ? 'Fechada' : 'Parcial';

    const now = new Date().toISOString();
    opp.history = opp.history || [];
    incoming.history = incoming.history || [];

    if (newStatusOpp !== opp.status) {
      opp.status = newStatusOpp;
      opp.history.push({ status: newStatusOpp, timestamp: now });
    }
    if (newStatusIncoming !== incoming.status) {
      incoming.status = newStatusIncoming;
      incoming.history.push({ status: newStatusIncoming, timestamp: now });
    }
  }
}

export async function fetchOrders(): Promise<Order[]> {
  await wait(300);
  return [...orders];
}

export async function createOrder(
  data: Omit<Order, 'id' | 'status' | 'dataHora' | 'quantidadeRestante' | 'history'>
): Promise<Order> {
  await wait(200);
  const nextId = Math.max(...orders.map(o => o.id), 0) + 1;
  const newOrder: Order = {
    id: nextId,
    instrumento: data.instrumento,
    lado: data.lado,
    preco: data.preco,
    quantidade: data.quantidade,
    quantidadeRestante: data.quantidade,
    status: 'Aberta',
    dataHora: new Date().toISOString(),
    history: [{ status: 'Aberta', timestamp: new Date().toISOString() }]
  };
  orders.push(newOrder);
  
  matchOrders(newOrder);

  return newOrder;
}

export async function updateOrder(
  id: number,
  changes: Partial<Order>
): Promise<Order> {
  await wait(200);
  const idx = orders.findIndex(o => o.id === id);
  if (idx === -1) throw new Error('Ordem não encontrada');

  orders[idx] = { ...orders[idx], ...changes };
  const updated = orders[idx];
  
  if (changes.quantidadeRestante !== undefined || changes.status !== undefined || changes.preco !== undefined) {
    matchOrders(updated);
  }

  return updated;
}

export async function deleteOrder(id: number): Promise<void> {
  await wait(100);
  orders = orders.filter(o => o.id !== id);
}
