import { products } from '../data/products';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentProducts: string[];
  onSelectProduct: (id: string) => void;
}

export default function HistoryModal({ isOpen, onClose, recentProducts, onSelectProduct }: HistoryModalProps) {
  if (!isOpen) return null;

  const historyItems = recentProducts.map(id => products.find(p => p.id === id)).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-slate-50 w-full max-h-[70vh] rounded-t-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-full duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="material-icons-round text-primary">history</span>
            浏览历史
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
            <span className="material-icons-round text-xl">close</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {historyItems.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <span className="material-icons-round text-4xl mb-2 opacity-50">history_toggle_off</span>
              <p className="text-sm">暂无浏览记录</p>
            </div>
          ) : (
            historyItems.map((item, idx) => item && (
              <div 
                key={`${item.id}-${idx}`}
                onClick={() => {
                  onSelectProduct(item.id);
                  onClose();
                }}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer active:scale-95 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-slate-800">{item.name}</span>
                    <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{item.tags.join(' · ')}</p>
                </div>
                <span className="material-icons-round text-slate-300">chevron_right</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
