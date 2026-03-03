import { useState } from 'react';
import Home from './components/Home';
import Inventory from './components/Inventory';
import IndustryCenter from './components/IndustryCenter';
import Profile from './components/Profile';
import BottomNav from './components/BottomNav';
import ToolModal from './components/ToolModal';
import ProductDetail from './components/ProductDetail';
import HistoryModal from './components/HistoryModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentProducts, setRecentProducts] = useState<string[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const navigateToInventory = (query: string) => {
    setSearchQuery(query);
    setActiveTab('inventory');
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProductId(id);
    setRecentProducts(prev => {
      const filtered = prev.filter(p => p !== id);
      return [id, ...filtered].slice(0, 10); // Keep up to 10 recent items
    });
  };

  if (selectedProductId) {
    return (
      <div className="flex-1 overflow-y-auto hide-scrollbar bg-slate-50">
        <ProductDetail 
          productId={selectedProductId} 
          onBack={() => setSelectedProductId(null)} 
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-28">
        {activeTab === 'home' && <Home onNavigateToIndustry={navigateToInventory} onOpenHistory={() => setIsHistoryOpen(true)} />}
        {activeTab === 'inventory' && <Inventory onSelectProduct={handleSelectProduct} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
        {activeTab === 'center' && <IndustryCenter onNavigateToIndustry={navigateToInventory} />}
        {activeTab === 'profile' && <Profile />}
      </div>
      
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenModal={() => setIsModalOpen(true)} 
      />
      
      <ToolModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <HistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        recentProducts={recentProducts} 
        onSelectProduct={handleSelectProduct} 
      />
    </>
  );
}
