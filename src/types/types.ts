export interface HistoryEntry {
  status: 'Aberta' | 'Parcial' | 'Fechada' | 'Cancelada' | string;
  timestamp: string; 
}

export interface Order {
  id: number;                  
  instrumento: string;         
  lado: 'Compra' | 'Venda';
  preco: number;
  quantidade: number;
  quantidadeRestante: number;
  status: 'Aberta' | 'Parcial' | 'Fechada' | 'Cancelada';
  dataHora: string;    
   history: HistoryEntry[];
}