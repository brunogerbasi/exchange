import React, { useState, useEffect } from 'react';
import './CreateOrderForm.styles.scss';
import { useOrdersStore } from '../../../stores/useOrdersStore';

interface CreateOrderFormProps {
  onSuccess?: () => void;
}

export const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ onSuccess }) => {
  const createOrder = useOrdersStore(state => state.createOrder);
  const [instrumento, setInstrumento] = useState('');
  const [lado, setLado] = useState<'Compra' | 'Venda'>('Compra');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const [errors, setErrors] = useState({
    instrumento: '',
    preco: '',
    quantidade: '',
  });


  const validateInstrumento = (value: string) => {
    if (!value.trim()) return 'Instrumento é obrigatório.';    
    if (!/^[A-Z]{4}\d$/.test(value.trim().toUpperCase())) {
      return 'Formato inválido. Ex: PETR4';
    }
    return '';
  };

  const validatePreco = (value: string) => {
    const num = parseFloat(value);
    if (!value) return 'Preço é obrigatório.';
    if (isNaN(num) || num <= 0) return 'Preço deve ser maior que 0.';
    return '';
  };

  const validateQuantidade = (value: string) => {
    const num = parseInt(value, 10);
    if (!value) return 'Quantidade é obrigatória.';
    if (isNaN(num) || num <= 0) return 'Quantidade deve ser inteiro > 0.';
    return '';
  };

  useEffect(() => {
    setErrors({
      instrumento: validateInstrumento(instrumento),
      preco: validatePreco(preco),
      quantidade: validateQuantidade(quantidade),
    });
  }, [instrumento, preco, quantidade]);

  const isFormValid =
    !errors.instrumento && !errors.preco && !errors.quantidade;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    await createOrder({
      instrumento: instrumento.trim().toUpperCase(),
      lado,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade, 10),
    });
    setInstrumento('');
    setPreco('');
    setQuantidade('');
    setLado('Compra');
    onSuccess?.();
  };

  return (
    <form className="create-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="instrumento">Instrumento</label>
        <input
          id="instrumento"
          type="text"
          value={instrumento}
          onChange={e => setInstrumento(e.target.value)}
          onBlur={e => setErrors(prev => ({ ...prev, instrumento: validateInstrumento(e.target.value) }))}
          placeholder="Ex: PETR4"
          className={errors.instrumento ? 'invalid' : ''}
        />
        {errors.instrumento && <span className="error-msg">{errors.instrumento}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="lado">Lado</label>
        <select
          id="lado"
          value={lado}
          onChange={e => setLado(e.target.value as any)}
        >
          <option value="Compra">Compra</option>
          <option value="Venda">Venda</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="preco">Preço (R$)</label>
        <input
          id="preco"
          type="number"
          value={preco}
          onChange={e => setPreco(e.target.value)}
          onBlur={e => setErrors(prev => ({ ...prev, preco: validatePreco(e.target.value) }))}
          min="0.01"
          step="0.01"
          className={errors.preco ? 'invalid' : ''}
        />
        {errors.preco && <span className="error-msg">{errors.preco}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="quantidade">Quantidade</label>
        <input
          id="quantidade"
          type="number"
          value={quantidade}
          onChange={e => setQuantidade(e.target.value)}
          onBlur={e => setErrors(prev => ({ ...prev, quantidade: validateQuantidade(e.target.value) }))}
          min="1"
          step="1"
          className={errors.quantidade ? 'invalid' : ''}
        />
        {errors.quantidade && <span className="error-msg">{errors.quantidade}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={!isFormValid} className="btn-submit">
          Salvar Ordem
        </button>
      </div>
    </form>
  );
};