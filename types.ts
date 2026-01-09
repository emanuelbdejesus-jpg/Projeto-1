
export type ToolModel = 'T45' | 'T50' | 'T51';

export interface ToolItem {
  id: string;
  name: string;
  model: ToolModel;
  stock: number;
  minStock: number;
  category: 'Punho' | 'Haste' | 'Bit';
}

export interface Withdrawal {
  id: string;
  toolId: string;
  toolName: string;
  model: ToolModel;
  quantity: number;
  date: string;
  reason: string;
  supervisor: string;
}

export interface AppState {
  inventory: ToolItem[];
  withdrawals: Withdrawal[];
}
