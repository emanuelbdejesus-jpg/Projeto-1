
import React, { useState } from 'react';
import { ToolItem, Withdrawal } from '../types';
import { SUPERVISORS, WITHDRAWAL_REASONS } from '../constants';

interface WithdrawalModalProps {
  inventory: ToolItem[];
  onClose: () => void;
  onSubmit: (withdrawal: Omit<Withdrawal, 'id'>) => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ inventory, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    toolId: inventory[0]?.id || '',
    quantity: 1,
    reason: WITHDRAWAL_REASONS[0],
    supervisor: SUPERVISORS[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tool = inventory.find(i => i.id === formData.toolId);
    if (!tool) return;

    if (formData.quantity > tool.stock) {
      alert('Quantidade solicitada superior ao estoque disponível!');
      return;
    }

    onSubmit({
      toolId: formData.toolId,
      toolName: tool.name,
      model: tool.model,
      quantity: formData.quantity,
      date: new Date().toISOString(),
      reason: formData.reason,
      supervisor: formData.supervisor
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Registrar Retirada</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ferramenta</label>
            <select 
              className="w-full rounded-lg border border-slate-200 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.toolId}
              onChange={e => setFormData({...formData, toolId: e.target.value})}
            >
              {inventory.map(item => (
                <option key={item.id} value={item.id}>
                  [{item.model}] {item.name} - Est: {item.stock}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Quantidade</label>
            <input 
              type="number" 
              min="1" 
              className="w-full rounded-lg border border-slate-200 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.quantity}
              onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Supervisor Responsável</label>
            <select 
              className="w-full rounded-lg border border-slate-200 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.supervisor}
              onChange={e => setFormData({...formData, supervisor: e.target.value})}
            >
              {SUPERVISORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Motivo da Retirada</label>
            <select 
              className="w-full rounded-lg border border-slate-200 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.reason}
              onChange={e => setFormData({...formData, reason: e.target.value})}
            >
              {WITHDRAWAL_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
