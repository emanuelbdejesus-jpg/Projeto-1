
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, Withdrawal, ToolItem, ToolModel } from './types';
import { INITIAL_INVENTORY } from './constants';
import { Dashboard } from './components/Dashboard';
import { WithdrawalModal } from './components/WithdrawalModal';
import { getInventoryInsights } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    inventory: INITIAL_INVENTORY,
    withdrawals: []
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'history'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [filterModel, setFilterModel] = useState<ToolModel | 'TODOS'>('TODOS');

  const handleAddWithdrawal = (withdrawalData: Omit<Withdrawal, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newWithdrawal: Withdrawal = { ...withdrawalData, id };

    setState(prev => ({
      inventory: prev.inventory.map(item => 
        item.id === withdrawalData.toolId 
          ? { ...item, stock: item.stock - withdrawalData.quantity } 
          : item
      ),
      withdrawals: [newWithdrawal, ...prev.withdrawals]
    }));
    setIsModalOpen(false);
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await getInventoryInsights(state);
    setAiInsight(result);
    setIsAnalyzing(false);
  };

  const filteredInventory = state.inventory.filter(i => 
    filterModel === 'TODOS' ? true : i.model === filterModel
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <i className="fa-solid fa-drill text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">DrillTrack Pro</h1>
              <p className="text-xs text-slate-500 font-medium">Gestão de Ferramental</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-100"
            >
              <i className="fa-solid fa-plus"></i>
              <span>Nova Retirada</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full space-y-6">
        {/* Tab Navigation */}
        <nav className="flex bg-white p-1 rounded-xl border border-slate-200 w-fit">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'chart-line' },
            { id: 'inventory', label: 'Estoque', icon: 'boxes-stacked' },
            { id: 'history', label: 'Histórico', icon: 'clock-rotate-left' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-slate-100 text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <i className={`fa-solid fa-${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Gemini AI Widget */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-wand-magic-sparkles text-blue-600"></i>
                <h3 className="font-semibold text-slate-800">Análise Inteligente Gemini</h3>
              </div>
              <button 
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzing}
                className="bg-white/80 hover:bg-white text-blue-600 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold transition-all disabled:opacity-50"
              >
                {isAnalyzing ? 'Analisando...' : 'Atualizar Insights'}
              </button>
            </div>
            {aiInsight ? (
              <div className="text-slate-600 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500 whitespace-pre-wrap">
                {aiInsight}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Clique em atualizar para obter uma análise preditiva baseada no seu estoque e histórico de consumo.</p>
            )}
          </div>
          <div className="absolute top-0 right-0 p-8 text-blue-200/20 pointer-events-none">
            <i className="fa-solid fa-brain text-8xl"></i>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="animate-in fade-in duration-300">
          {activeTab === 'dashboard' && <Dashboard state={state} />}

          {activeTab === 'inventory' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <i className="fa-solid fa-list-ul text-blue-500"></i>
                  Listagem de Peças
                </h3>
                <div className="flex gap-2">
                  {['TODOS', 'T45', 'T50', 'T51'].map(m => (
                    <button
                      key={m}
                      onClick={() => setFilterModel(m as any)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        filterModel === m 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Item</th>
                      <th className="px-6 py-4">Modelo</th>
                      <th className="px-6 py-4">Estoque</th>
                      <th className="px-6 py-4">Min. Necessário</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredInventory.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">{item.name}</div>
                          <div className="text-xs text-slate-400 uppercase font-medium">{item.category}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-600">
                            {item.model}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-700">{item.stock}</td>
                        <td className="px-6 py-4 text-slate-500">{item.minStock}</td>
                        <td className="px-6 py-4">
                          {item.stock <= item.minStock ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                              Crítico
                            </span>
                          ) : item.stock <= item.minStock * 1.5 ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                              Alerta
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                              Ok
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <i className="fa-solid fa-history text-amber-500"></i>
                  Log de Movimentações
                </h3>
              </div>
              {state.withdrawals.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-slate-200 text-6xl mb-4"><i className="fa-solid fa-folder-open"></i></div>
                  <p className="text-slate-400">Nenhuma retirada registrada ainda.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Data/Hora</th>
                        <th className="px-6 py-4">Item/Modelo</th>
                        <th className="px-6 py-4">Qtd</th>
                        <th className="px-6 py-4">Supervisor</th>
                        <th className="px-6 py-4">Motivo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {state.withdrawals.map(w => (
                        <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-slate-500">
                            {new Date(w.date).toLocaleString('pt-BR')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-800">{w.toolName}</div>
                            <span className="text-[10px] bg-slate-100 px-1 rounded font-bold text-slate-400">{w.model}</span>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-700">-{w.quantity}</td>
                          <td className="px-6 py-4 text-slate-600 font-medium">{w.supervisor}</td>
                          <td className="px-6 py-4">
                            <span className="text-xs italic text-slate-500">{w.reason}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-400">
        <p>&copy; 2024 DrillTrack Pro - Sistema Inteligente de Gestão de Ativos</p>
      </footer>

      {/* New Withdrawal Modal */}
      {isModalOpen && (
        <WithdrawalModal 
          inventory={state.inventory}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddWithdrawal}
        />
      )}
    </div>
  );
};

export default App;
