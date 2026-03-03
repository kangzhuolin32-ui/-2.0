import { useState, useEffect } from 'react';

interface HomeProps {
  onNavigateToIndustry: (query: string) => void;
  onOpenHistory: () => void;
}

export default function Home({ onNavigateToIndustry, onOpenHistory }: HomeProps) {
  return (
    <div className="px-6 pt-12 pb-6">
      <header className="flex justify-between items-start mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-black italic tracking-tight text-slate-800">BIFU SPECIAL STEEL</h1>
          <p className="text-primary font-semibold text-sm tracking-wide">专业特钢数据库</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenHistory}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 active:scale-95 transition-transform"
          >
            <span className="material-icons-round text-xl">schedule</span>
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-white/50">
          <p className="text-xs text-slate-400 mb-1 font-medium">现货型号</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">24</span>
            <span className="text-sm font-medium text-slate-500">款</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-white/50">
          <p className="text-xs text-slate-400 mb-1 font-medium">垂直行业</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">4</span>
            <span className="text-sm font-medium text-slate-500">类</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-400 mb-4 px-1">行业快捷进入</h2>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => onNavigateToIndustry('轴承')}
            className="bg-white p-4 rounded-3xl shadow-sm border border-white/50 flex items-center gap-3 active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <span className="material-icons-round">adjust</span>
            </div>
            <span className="font-bold text-sm">轴承行业</span>
          </button>
          <button 
            onClick={() => onNavigateToIndustry('模具')}
            className="bg-white p-4 rounded-3xl shadow-sm border border-white/50 flex items-center gap-3 active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <span className="material-icons-round">settings</span>
            </div>
            <span className="font-bold text-sm">模具制造</span>
          </button>
          <button 
            onClick={() => onNavigateToIndustry('机械')}
            className="bg-white p-4 rounded-3xl shadow-sm border border-white/50 flex items-center gap-3 active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <span className="material-icons-round">business_center</span>
            </div>
            <span className="font-bold text-sm">机械结构</span>
          </button>
          <button 
            onClick={() => onNavigateToIndustry('汽车')}
            className="bg-white p-4 rounded-3xl shadow-sm border border-white/50 flex items-center gap-3 active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <span className="material-icons-round">directions_car</span>
            </div>
            <span className="font-bold text-sm">汽车零部件</span>
          </button>
        </div>
      </section>
    </div>
  );
}
