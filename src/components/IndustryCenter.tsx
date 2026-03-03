interface IndustryCenterProps {
  onNavigateToIndustry: (query: string) => void;
}

export default function IndustryCenter({ onNavigateToIndustry }: IndustryCenterProps) {
  const industries = [
    {
      title: '轴承行业',
      query: '轴承',
      desc: '高硬度、长寿命解决方案',
      icon: 'adjust',
      color: 'bg-blue-500',
      shadow: 'shadow-blue-500/20'
    },
    {
      title: '模具制造',
      query: '模具',
      desc: '耐磨损、抗冲击模具钢',
      icon: 'settings_suggest',
      color: 'bg-purple-500',
      shadow: 'shadow-purple-500/20'
    },
    {
      title: '机械结构',
      query: '机械',
      desc: '高韧性、高强度调质钢',
      icon: 'work_outline',
      color: 'bg-teal-500',
      shadow: 'shadow-teal-500/20'
    },
    {
      title: '汽车零部件',
      query: '汽车',
      desc: '高性能动力系统专用钢',
      icon: 'directions_car',
      color: 'bg-orange-500',
      shadow: 'shadow-orange-500/20'
    }
  ];

  return (
    <div className="px-6 pt-12">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">应用行业中心</h1>
        <p className="text-sm text-slate-500 mt-1">懂你的行业，更懂你的材料选择</p>
      </header>

      <div className="space-y-4">
        {industries.map((ind, idx) => (
          <div 
            key={idx} 
            onClick={() => onNavigateToIndustry(ind.query)}
            className="bg-white/90 backdrop-blur-md rounded-2xl p-5 flex items-center relative overflow-hidden group active:scale-[0.98] transition-all border border-white/20 shadow-sm cursor-pointer"
          >
            <div className={`w-14 h-14 rounded-xl ${ind.color} flex items-center justify-center text-white shadow-lg ${ind.shadow} z-10`}>
              <span className="material-icons-round text-3xl">{ind.icon}</span>
            </div>
            <div className="ml-4 z-10">
              <h3 className="text-lg font-bold text-slate-800 leading-tight">{ind.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{ind.desc}</p>
            </div>
            <span className="material-icons-round absolute -right-4 -bottom-4 text-[100px] text-slate-100 pointer-events-none z-0">
              {ind.icon}
            </span>
            <span className="material-icons-round ml-auto text-slate-300 z-10">chevron_right</span>
          </div>
        ))}
      </div>
    </div>
  );
}
