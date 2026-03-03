import { products } from '../data/products';

interface InventoryProps {
  onSelectProduct: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Inventory({ onSelectProduct, searchQuery, setSearchQuery }: InventoryProps) {
  const filteredProducts = products.filter(p => {
    const query = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) || 
      p.type.toLowerCase().includes(query) ||
      p.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div className="px-6 pt-12">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-primary">{filteredProducts.length}</span>
          <span>款精准现货清单</span>
        </h1>
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="material-icons-round text-slate-400 text-xl">search</span>
          </div>
          <input 
            type="text" 
            placeholder="搜索型号、类型或特性..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-slate-400 transition-all outline-none"
          />
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {filteredProducts.map((item) => (
          <div 
            key={item.id} 
            onClick={() => onSelectProduct(item.id)}
            className="bg-white p-4 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer active:scale-95"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {item.type}
              </span>
              <span className="material-icons-round text-slate-300 text-sm">chevron_right</span>
            </div>
            <div className="text-lg font-bold text-slate-800">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
