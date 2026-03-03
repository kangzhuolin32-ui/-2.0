interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenModal: () => void;
}

export default function BottomNav({ activeTab, setActiveTab, onOpenModal }: BottomNavProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 pointer-events-none">
      <div className="glass-nav rounded-[2.5rem] shadow-2xl flex items-center justify-between px-2 py-2 relative border border-white/20 pointer-events-auto">
        <div className="flex flex-1 justify-around items-center z-10">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-primary' : 'text-slate-400'}`}
          >
            <div className="p-1">
              <span className="material-icons-round text-2xl">home</span>
            </div>
            <span className="text-[10px] font-bold">首页</span>
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'inventory' ? 'text-primary' : 'text-slate-400'}`}
          >
            <div className="p-1">
              <span className="material-icons-round text-2xl">layers</span>
            </div>
            <span className="text-[10px] font-bold">清单</span>
          </button>
        </div>
        
        <div className="relative -top-8 mx-4 flex flex-col items-center">
          <div className="absolute -top-10 bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 animate-bounce whitespace-nowrap z-20">
            <span className="material-icons-round text-[14px]">touch_app</span>
            打开工具箱
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
          </div>
          <button 
            onClick={onOpenModal}
            className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/40 transform active:scale-90 transition-transform relative z-10"
          >
            <span className="material-icons-round text-3xl">apps</span>
          </button>
        </div>
        
        <div className="flex flex-1 justify-around items-center z-10">
          <button 
            onClick={() => setActiveTab('center')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'center' ? 'text-primary' : 'text-slate-400'}`}
          >
            <div className="p-1">
              <span className="material-icons-round text-2xl">gps_fixed</span>
            </div>
            <span className="text-[10px] font-bold">中心</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-primary' : 'text-slate-400'}`}
          >
            <div className="p-1">
              <span className="material-icons-round text-2xl">person_outline</span>
            </div>
            <span className="text-[10px] font-bold">我的</span>
          </button>
        </div>
      </div>
    </div>
  );
}
