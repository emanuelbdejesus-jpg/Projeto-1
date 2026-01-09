
import { ToolItem } from './types';

export const INITIAL_INVENTORY: ToolItem[] = [
  // T51
  { id: 't51-p', name: 'Punho T51', model: 'T51', stock: 15, minStock: 5, category: 'Punho' },
  { id: 't51-h', name: 'Haste T51', model: 'T51', stock: 25, minStock: 8, category: 'Haste' },
  { id: 't51-b35', name: "Bit 3,5'' T51", model: 'T51', stock: 40, minStock: 10, category: 'Bit' },
  { id: 't51-b45', name: "Bit 4,5'' T51", model: 'T51', stock: 35, minStock: 10, category: 'Bit' },
  // T50
  { id: 't50-p', name: 'Punho T50', model: 'T50', stock: 12, minStock: 4, category: 'Punho' },
  { id: 't50-h', name: 'Haste T50', model: 'T50', stock: 20, minStock: 6, category: 'Haste' },
  { id: 't50-b45', name: "Bit 4,5'' T50", model: 'T50', stock: 30, minStock: 8, category: 'Bit' },
  // T45
  { id: 't45-p', name: 'Punho T45', model: 'T45', stock: 18, minStock: 5, category: 'Punho' },
  { id: 't45-h', name: 'Haste T45', model: 'T45', stock: 30, minStock: 10, category: 'Haste' },
  { id: 't45-b35', name: "Bit 3,5'' T45", model: 'T45', stock: 45, minStock: 15, category: 'Bit' },
  { id: 't45-b45', name: "Bit 4,5'' T45", model: 'T45', stock: 38, minStock: 12, category: 'Bit' },
];

export const SUPERVISORS = [
  'Carlos Oliveira',
  'Ana Silva',
  'Marcos Pereira',
  'Juliana Santos',
  'Ricardo Lima'
];

export const WITHDRAWAL_REASONS = [
  'Desgaste Natural',
  'Quebra em Operação',
  'Perda de Diâmetro',
  'Troca de Frente de Lavra',
  'Manutenção Preventiva'
];
