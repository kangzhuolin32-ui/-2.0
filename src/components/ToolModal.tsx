import { useEffect, useState } from 'react';
import { products, getProductDetails } from '../data/products';
import { equivalentsData } from '../data/equivalents';
import { compositionsData } from '../data/compositions';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FavoriteItem {
  id: string;
  name: string;
  productId: string;
  shape: 'plate' | 'round';
  length: string;
  width: string;
  thickness: string;
  diameter: string;
}

interface TallyRecord {
  id: string;
  timestamp: number;
  material: string;
  spec: string;
  quantity: number;
  unitWeight: number;
  totalWeight: number;
}

export default function ToolModal({ isOpen, onClose }: ToolModalProps) {
  const [show, setShow] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  // Favorites state
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    const saved = localStorage.getItem('bifu_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bifu_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Weight calculator state
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
  const [shape, setShape] = useState<'plate' | 'round'>('plate');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [thickness, setThickness] = useState('');
  const [diameter, setDiameter] = useState('');
  const [quantity, setQuantity] = useState('1');

  // Tally state
  const [tallyRecords, setTallyRecords] = useState<TallyRecord[]>(() => {
    const saved = localStorage.getItem('bifu_tally');
    return saved ? JSON.parse(saved) : [];
  });
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedTallyIds, setSelectedTallyIds] = useState<string[]>([]);
  const [showTallySuccess, setShowTallySuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('bifu_tally', JSON.stringify(tallyRecords));
  }, [tallyRecords]);

  // Comparison state
  const [compareId1, setCompareId1] = useState(products[0].id);
  const [compareId2, setCompareId2] = useState(products[1].id);

  // Heat Treatment state
  const [htProductId, setHtProductId] = useState(products[0].id);

  // Unit Converter state
  const [unitProductId, setUnitProductId] = useState(products[0].id);
  const [unitCategory, setUnitCategory] = useState<'density' | 'strength' | 'length'>('density');
  const [unitInputValue, setUnitInputValue] = useState<string>('');
  const [unitFrom, setUnitFrom] = useState<string>('g/cm³');
  const [unitTo, setUnitTo] = useState<string>('lb/in³');

  // Equivalents state
  const [equivSearch, setEquivSearch] = useState('');

  // Compositions state
  const [compSearch, setCompSearch] = useState('');

  // Cutting Loss state
  const [cutTotalLength, setCutTotalLength] = useState('6000');
  const [cutPieceLength, setCutPieceLength] = useState('');
  const [cutKerf, setCutKerf] = useState('3');
  const [cutTrim, setCutTrim] = useState('0');

  useEffect(() => {
    if (activeTool === 'unit' && unitCategory === 'density') {
      const p = products.find(p => p.id === unitProductId);
      if (p) {
        setUnitInputValue(p.density.toString());
        setUnitFrom('g/cm³');
        setUnitTo('lb/in³');
      }
    }
  }, [unitProductId, unitCategory, activeTool]);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setActiveTool(null);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show && !isOpen) return null;

  const calculateUnitWeight = () => {
    const product = products.find(p => p.id === selectedProductId);
    // Convert density from g/cm³ to kg/mm³ (divide by 1,000,000)
    const density = product ? product.density * 0.000001 : 0.00000785; 
    
    const l = parseFloat(length) || 0;
    if (shape === 'plate') {
      const w = parseFloat(width) || 0;
      const t = parseFloat(thickness) || 0;
      return l * w * t * density;
    } else {
      const d = parseFloat(diameter) || 0;
      const r = d / 2;
      return Math.PI * r * r * l * density;
    }
  };

  const calculateTotalWeight = () => {
    const uw = calculateUnitWeight();
    const q = parseInt(quantity) || 1;
    return (uw * q).toFixed(2);
  };

  const addToTally = () => {
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const q = parseInt(quantity) || 1;
    const uw = calculateUnitWeight();
    const tw = uw * q;

    let spec = '';
    if (shape === 'plate') {
      spec = `${length || '?'}*${width || '?'}*${thickness || '?'}`;
    } else {
      spec = `Φ${diameter || '?'}*${length || '?'}`;
    }

    const newRecord: TallyRecord = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      material: product.name,
      spec,
      quantity: q,
      unitWeight: uw,
      totalWeight: tw
    };

    const newRecords = [newRecord, ...tallyRecords].slice(0, 50);
    setTallyRecords(newRecords);
    
    setToastMessage('已加入码单');
    setTimeout(() => setToastMessage(''), 2000);
  };

  const generateTallyImage = (recordsToExport: TallyRecord[]) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 750;
    const headerHeight = 180;
    const rowHeight = 60;
    const tableHeaderHeight = 60;
    const footerHeight = 140;
    const height = headerHeight + tableHeaderHeight + (recordsToExport.length * rowHeight) + footerHeight;

    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Header
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('必富特钢有限公司', 40, 60);

    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('电子码单', width / 2, 110);

    const now = new Date();
    const serialNo = `NO.${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;
    ctx.font = '20px monospace';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#64748b';
    ctx.fillText(serialNo, width - 40, 60);

    // Table Header
    let y = headerHeight;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(40, y, width - 80, tableHeaderHeight);
    
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('序号', 80, y + 38);
    ctx.textAlign = 'left';
    ctx.fillText('材质/品名', 130, y + 38);
    ctx.fillText('规格(mm)', 300, y + 38);
    ctx.textAlign = 'right';
    ctx.fillText('数量', 560, y + 38);
    ctx.fillText('理重(t)', width - 60, y + 38);

    y += tableHeaderHeight;

    // Rows
    let totalQty = 0;
    let totalWeight = 0;

    recordsToExport.forEach((record, index) => {
      if (index % 2 === 1) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(40, y, width - 80, rowHeight);
      }

      ctx.fillStyle = '#334155';
      ctx.font = '20px sans-serif';
      
      ctx.textAlign = 'center';
      ctx.fillText((index + 1).toString(), 80, y + 38);
      
      ctx.textAlign = 'left';
      ctx.fillText(record.material, 130, y + 38);
      ctx.fillText(record.spec, 300, y + 38);
      
      ctx.textAlign = 'right';
      ctx.fillText(record.quantity.toString(), 560, y + 38);
      const weightT = (record.totalWeight / 1000).toFixed(3);
      ctx.fillText(weightT, width - 60, y + 38);

      totalQty += record.quantity;
      totalWeight += record.totalWeight;
      y += rowHeight;
    });

    // Summary Line
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(width - 40, y);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#cbd5e1';
    ctx.stroke();

    y += 50;
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`合计：${totalQty} 件 / ${(totalWeight / 1000).toFixed(3)} 吨`, width - 60, y);

    // Footer
    y += 60;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'left';
    const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    ctx.fillText(`生成时间：${timeStr}`, 40, y);
    
    y += 30;
    ctx.fillText('本数据由客户本地测算，不作为最终贸易结算凭证。', 40, y);
    
    ctx.textAlign = 'right';
    ctx.fillText('由“必富特钢助手”App 生成', width - 40, y);

    // Download
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const link = document.createElement('a');
    link.download = `BF_Tally_${now.getTime()}.jpg`;
    link.href = dataUrl;
    link.click();
  };

  const renderToolboxMenu = () => (
    <>
      <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">特钢工具箱</h3>
      <div className="grid grid-cols-3 gap-y-8 gap-x-4">
        <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => setActiveTool('weight')}>
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shadow-inner group-active:scale-95 transition-transform">
            <span className="material-icons-round text-2xl">balance</span>
          </div>
          <span className="text-xs font-medium text-slate-600">重量计算</span>
        </div>
        <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => setActiveTool('favorites')}>
          <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shadow-inner group-active:scale-95 transition-transform">
            <span className="material-icons-round text-2xl">bookmarks</span>
          </div>
          <span className="text-xs font-medium text-slate-600">常购清单</span>
        </div>
        <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => setActiveTool('compare')}>
          <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 shadow-inner group-active:scale-95 transition-transform">
            <span className="material-icons-round text-2xl">swap_horiz</span>
          </div>
          <span className="text-xs font-medium text-slate-600">属性对比</span>
        </div>
        <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => setActiveTool('heatTreatment')}>
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shadow-inner group-active:scale-95 transition-transform">
            <span className="material-icons-round text-2xl">local_fire_department</span>
          </div>
          <span className="text-xs font-medium text-slate-600">热处理</span>
        </div>
        <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => setActiveTool('unit')}>
          <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center text-teal-500 shadow-inner group-active:scale-95 transition-transform">
            <span className="material-icons-round text-2xl">sync</span>
          </div>
          <span className="text-xs font-medium text-slate-600">单位换算</span>
        </div>
        <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => setActiveTool('equivalents')}>
          <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-inner group-active:scale-95 transition-transform">
            <span className="material-icons-round text-2xl">find_replace</span>
          </div>
          <span className="text-xs font-medium text-slate-600">材质替代</span>
        </div>
        <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => setActiveTool('tally')}>
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-inner group-active:scale-95 transition-transform">
            <span className="material-icons-round text-2xl">receipt_long</span>
          </div>
          <span className="text-xs font-medium text-slate-600">电子码单</span>
        </div>
        <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => setActiveTool('compositions')}>
          <div className="w-14 h-14 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-500 shadow-inner group-active:scale-95 transition-transform">
            <span className="material-icons-round text-2xl">science</span>
          </div>
          <span className="text-xs font-medium text-slate-600">成分速查</span>
        </div>
        <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => setActiveTool('cutting')}>
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shadow-inner group-active:scale-95 transition-transform">
            <span className="material-icons-round text-2xl">content_cut</span>
          </div>
          <span className="text-xs font-medium text-slate-600">切料损耗</span>
        </div>
      </div>
    </>
  );

  const renderHeatTreatment = () => {
    const product = getProductDetails(htProductId);
    if (!product) return null;

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center mb-6">
          <button onClick={() => setActiveTool(null)} className="mr-2 text-slate-400 hover:text-slate-600">
            <span className="material-icons-round">arrow_back</span>
          </button>
          <h3 className="text-lg font-bold text-slate-800">热处理工艺</h3>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <label className="w-12 text-sm text-slate-600">材质</label>
          <select 
            value={htProductId} 
            onChange={e => setHtProductId(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400 text-slate-700 font-bold"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-orange-600">
            <span className="material-icons-round text-lg">thermostat</span>
            <h4 className="font-bold text-sm">工艺参数参考</h4>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            {product.heatTreatment}
          </p>
          
          <div className="mt-4 pt-4 border-t border-orange-200/50">
            <div className="flex items-start gap-2 text-xs text-slate-500">
              <span className="material-icons-round text-[14px] mt-0.5 text-orange-400">info</span>
              <p>注：以上参数为理论参考值。实际热处理工艺需根据工件的具体尺寸、形状复杂程度及最终性能要求进行适当调整。</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const saveToFavorites = () => {
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;
    
    let name = '';
    if (shape === 'plate') {
      name = `${product.name} 板材 ${length || '?'}x${width || '?'}x${thickness || '?'}`;
    } else {
      name = `${product.name} 圆钢 L:${length || '?'} Φ:${diameter || '?'}`;
    }

    const newItem: FavoriteItem = {
      id: Date.now().toString(),
      name,
      productId: selectedProductId,
      shape,
      length,
      width,
      thickness,
      diameter
    };

    setFavorites([newItem, ...favorites]);
  };

  const renderFavorites = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 h-full flex flex-col">
      <div className="flex items-center mb-6 shrink-0">
        <button onClick={() => setActiveTool(null)} className="mr-2 text-slate-400 hover:text-slate-600">
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h3 className="text-lg font-bold text-slate-800">常购清单</h3>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar -mx-2 px-2 space-y-3 pb-4">
        {favorites.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <span className="material-icons-round text-4xl mb-2 opacity-50">bookmark_border</span>
            <p className="text-sm">暂无收藏记录</p>
            <p className="text-xs mt-1">在重量计算器中点击收藏即可保存</p>
          </div>
        ) : (
          favorites.map(item => (
            <div 
              key={item.id} 
              className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between group"
            >
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => {
                  setSelectedProductId(item.productId);
                  setShape(item.shape);
                  setLength(item.length);
                  setWidth(item.width);
                  setThickness(item.thickness);
                  setDiameter(item.diameter);
                  setActiveTool('weight');
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-icons-round text-rose-400 text-sm">bookmark</span>
                  <span className="font-bold text-slate-800 text-sm">{products.find(p => p.id === item.productId)?.name}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">{item.shape === 'plate' ? '板材' : '圆钢'}</span>
                </div>
                <p className="text-xs text-slate-500 pl-6">
                  {item.shape === 'plate' 
                    ? `长:${item.length || '-'} 宽:${item.width || '-'} 厚:${item.thickness || '-'}`
                    : `长:${item.length || '-'} 直径:${item.diameter || '-'}`
                  }
                </p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setFavorites(favorites.filter(f => f.id !== item.id));
                }}
                className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"
              >
                <span className="material-icons-round text-sm">delete_outline</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderWeightCalculator = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={() => setActiveTool(null)} className="mr-2 text-slate-400 hover:text-slate-600">
            <span className="material-icons-round">arrow_back</span>
          </button>
          <h3 className="text-lg font-bold text-slate-800">重量计算器</h3>
        </div>
        <button 
          onClick={saveToFavorites}
          className="text-rose-500 flex items-center gap-1 text-sm font-medium bg-rose-50 px-3 py-1.5 rounded-full active:scale-95 transition-transform"
        >
          <span className="material-icons-round text-sm">bookmark_add</span>
          收藏
        </button>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <label className="w-12 text-sm text-slate-600">材质</label>
        <select 
          value={selectedProductId} 
          onChange={e => setSelectedProductId(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 text-slate-700"
        >
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.density} g/cm³)</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 mb-4 p-1 bg-slate-100 rounded-lg">
        <button 
          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${shape === 'plate' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
          onClick={() => setShape('plate')}
        >
          板材
        </button>
        <button 
          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${shape === 'round' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
          onClick={() => setShape('round')}
        >
          圆钢
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {shape === 'plate' ? (
          <>
            <div className="flex items-center gap-2">
              <label className="w-12 text-sm text-slate-600">长度</label>
              <input type="number" value={length} onChange={e => setLength(e.target.value)} placeholder="mm" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-12 text-sm text-slate-600">宽度</label>
              <input type="number" value={width} onChange={e => setWidth(e.target.value)} placeholder="mm" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-12 text-sm text-slate-600">厚度</label>
              <input type="number" value={thickness} onChange={e => setThickness(e.target.value)} placeholder="mm" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <label className="w-12 text-sm text-slate-600">长度</label>
              <input type="number" value={length} onChange={e => setLength(e.target.value)} placeholder="mm" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-12 text-sm text-slate-600">直径</label>
              <input type="number" value={diameter} onChange={e => setDiameter(e.target.value)} placeholder="mm" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
            </div>
          </>
        )}
        <div className="flex items-center gap-2">
          <label className="w-12 text-sm text-slate-600">数量</label>
          <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="件/支" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800">单件重量</span>
          <div className="text-right">
            <span className="text-lg font-bold text-blue-600">{calculateUnitWeight().toFixed(2)}</span>
            <span className="text-xs text-blue-500 ml-1">kg</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-blue-100 pt-2">
          <span className="text-sm font-bold text-blue-900">总重量</span>
          <div className="text-right">
            <span className="text-2xl font-black text-blue-700">{calculateTotalWeight()}</span>
            <span className="text-sm text-blue-600 ml-1">kg</span>
          </div>
        </div>
      </div>

      <button 
        onClick={addToTally}
        className="w-full mt-4 bg-slate-800 text-white py-3 rounded-xl font-bold active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-md"
      >
        <span className="material-icons-round">playlist_add</span>
        加入电子码单
      </button>
    </div>
  );

  const renderComparison = () => {
    const p1 = getProductDetails(compareId1);
    const p2 = getProductDetails(compareId2);

    if (!p1 || !p2) return null;

    const allElements = Array.from(new Set([
      ...Object.keys(p1.composition),
      ...Object.keys(p2.composition)
    ]));

    const radarChartData = [
      { subject: '硬度', A: p1.radarData.hardness, B: p2.radarData.hardness, fullMark: 100 },
      { subject: '韧性', A: p1.radarData.toughness, B: p2.radarData.toughness, fullMark: 100 },
      { subject: '屈服强度', A: p1.radarData.yieldStrength, B: p2.radarData.yieldStrength, fullMark: 100 },
      { subject: '淬透性', A: p1.radarData.hardenability, B: p2.radarData.hardenability, fullMark: 100 },
      { subject: '耐磨性', A: p1.radarData.wearResistance, B: p2.radarData.wearResistance, fullMark: 100 },
    ];

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 h-full flex flex-col">
        <div className="flex items-center mb-6 shrink-0">
          <button onClick={() => setActiveTool(null)} className="mr-2 text-slate-400 hover:text-slate-600">
            <span className="material-icons-round">arrow_back</span>
          </button>
          <h3 className="text-lg font-bold text-slate-800">属性对比</h3>
        </div>

        <div className="flex gap-2 mb-6 shrink-0">
          <div className="flex-1">
            <select 
              value={compareId1} 
              onChange={e => setCompareId1(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-purple-400 text-slate-700 font-bold"
            >
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-center px-1 text-slate-300">
            <span className="material-icons-round text-sm">compare_arrows</span>
          </div>
          <div className="flex-1">
            <select 
              value={compareId2} 
              onChange={e => setCompareId2(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-purple-400 text-slate-700 font-bold"
            >
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar -mx-2 px-2 space-y-6 pb-4">
          {/* 性能雷达图 */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">性能对比</h4>
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarChartData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name={p1.name} dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                  <Radar name={p2.name} dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 基本信息 */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">基本信息</h4>
            <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
              <div className="grid grid-cols-3 divide-x divide-slate-200 border-b border-slate-200 text-xs">
                <div className="p-2 text-slate-500 font-medium">类型</div>
                <div className="p-2 text-slate-800">{p1.type}</div>
                <div className="p-2 text-slate-800">{p2.type}</div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-slate-200 text-xs">
                <div className="p-2 text-slate-500 font-medium">密度</div>
                <div className="p-2 text-slate-800">{p1.density} g/cm³</div>
                <div className="p-2 text-slate-800">{p2.density} g/cm³</div>
              </div>
            </div>
          </div>

          {/* 化学成分 */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">化学成分 (%)</h4>
            <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
              {allElements.map((el, idx) => (
                <div key={el} className={`grid grid-cols-3 divide-x divide-slate-200 text-xs ${idx !== allElements.length - 1 ? 'border-b border-slate-200' : ''}`}>
                  <div className="p-2 text-slate-500 font-bold">{el}</div>
                  <div className={`p-2 font-mono ${p1.composition[el] ? 'text-slate-800' : 'text-slate-300'}`}>
                    {p1.composition[el] || '-'}
                  </div>
                  <div className={`p-2 font-mono ${p2.composition[el] ? 'text-slate-800' : 'text-slate-300'}`}>
                    {p2.composition[el] || '-'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 标签对比 */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">特性标签</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-wrap gap-1">
                {p1.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-medium text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {p2.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-medium text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUnitConverter = () => {
    const units = {
      density: ['g/cm³', 'kg/m³', 'lb/in³'],
      strength: ['MPa', 'ksi', 'kgf/mm²'],
      length: ['mm', 'm', 'inch', 'ft']
    };

    const handleCategoryChange = (cat: 'density' | 'strength' | 'length') => {
      setUnitCategory(cat);
      setUnitFrom(units[cat][0]);
      setUnitTo(units[cat][1]);
      if (cat !== 'density') {
        setUnitInputValue('');
      } else {
        const p = products.find(p => p.id === unitProductId);
        if (p) setUnitInputValue(p.density.toString());
      }
    };

    const convertUnit = () => {
      const val = parseFloat(unitInputValue);
      if (isNaN(val)) return '-';

      if (unitCategory === 'density') {
        let baseVal = val;
        if (unitFrom === 'kg/m³') baseVal = val / 1000;
        if (unitFrom === 'lb/in³') baseVal = val / 0.036127;

        if (unitTo === 'g/cm³') return baseVal.toFixed(2);
        if (unitTo === 'kg/m³') return (baseVal * 1000).toFixed(2);
        if (unitTo === 'lb/in³') return (baseVal * 0.036127).toFixed(4);
      }
      if (unitCategory === 'strength') {
        let baseVal = val;
        if (unitFrom === 'ksi') baseVal = val / 0.145038;
        if (unitFrom === 'kgf/mm²') baseVal = val / 0.10197;

        if (unitTo === 'MPa') return baseVal.toFixed(2);
        if (unitTo === 'ksi') return (baseVal * 0.145038).toFixed(2);
        if (unitTo === 'kgf/mm²') return (baseVal * 0.10197).toFixed(2);
      }
      if (unitCategory === 'length') {
        let baseVal = val;
        if (unitFrom === 'm') baseVal = val * 1000;
        if (unitFrom === 'inch') baseVal = val * 25.4;
        if (unitFrom === 'ft') baseVal = val * 304.8;

        if (unitTo === 'mm') return baseVal.toFixed(2);
        if (unitTo === 'm') return (baseVal / 1000).toFixed(4);
        if (unitTo === 'inch') return (baseVal / 25.4).toFixed(4);
        if (unitTo === 'ft') return (baseVal / 304.8).toFixed(4);
      }
      return '-';
    };

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center mb-6">
          <button onClick={() => setActiveTool(null)} className="mr-2 text-slate-400 hover:text-slate-600">
            <span className="material-icons-round">arrow_back</span>
          </button>
          <h3 className="text-lg font-bold text-slate-800">单位换算</h3>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <label className="w-12 text-sm text-slate-600">材质</label>
          <select 
            value={unitProductId} 
            onChange={e => setUnitProductId(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-400 text-slate-700 font-bold"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-lg">
          <button 
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${unitCategory === 'density' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500'}`}
            onClick={() => handleCategoryChange('density')}
          >
            密度
          </button>
          <button 
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${unitCategory === 'strength' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500'}`}
            onClick={() => handleCategoryChange('strength')}
          >
            强度
          </button>
          <button 
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${unitCategory === 'length' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500'}`}
            onClick={() => handleCategoryChange('length')}
          >
            长度
          </button>
        </div>

        <div className="space-y-4 mb-2">
          <div className="flex gap-2">
            <input 
              type="number" 
              value={unitInputValue} 
              onChange={e => setUnitInputValue(e.target.value)} 
              placeholder="输入数值" 
              className="flex-1 w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-400" 
            />
            <select 
              value={unitFrom} 
              onChange={e => setUnitFrom(e.target.value)}
              className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-teal-400 text-slate-700"
            >
              {units[unitCategory].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          
          <div className="flex justify-center text-slate-300">
            <span className="material-icons-round">swap_vert</span>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 w-1/2 bg-teal-50 border border-teal-100 rounded-lg px-3 py-2 text-sm text-teal-700 font-bold flex items-center overflow-x-auto">
              {convertUnit()}
            </div>
            <select 
              value={unitTo} 
              onChange={e => setUnitTo(e.target.value)}
              className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-teal-400 text-slate-700"
            >
              {units[unitCategory].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </div>
    );
  };

  const renderEquivalents = () => {
    const filtered = equivalentsData.filter(item => {
      const query = equivSearch.toLowerCase();
      return item.gb.toLowerCase().includes(query) ||
             item.astm.toLowerCase().includes(query) ||
             item.din.toLowerCase().includes(query) ||
             item.jis.toLowerCase().includes(query) ||
             item.category.toLowerCase().includes(query);
    });

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 h-full flex flex-col">
        <div className="flex items-center mb-6 shrink-0">
          <button onClick={() => setActiveTool(null)} className="mr-2 text-slate-400 hover:text-slate-600">
            <span className="material-icons-round">arrow_back</span>
          </button>
          <h3 className="text-lg font-bold text-slate-800">材质替代 (牌号对照)</h3>
        </div>

        <div className="relative mb-4 shrink-0">
          <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input 
            type="text" 
            placeholder="输入牌号搜索 (如: 45, 304, P20)..." 
            value={equivSearch}
            onChange={e => setEquivSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-indigo-400 transition-colors"
          />
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar -mx-2 px-2 space-y-3 pb-4">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p className="text-sm">未找到匹配的牌号</p>
            </div>
          ) : (
            filtered.map(item => (
              <div key={item.id} className="bg-slate-50 border border-slate-100 rounded-xl overflow-hidden">
                <div className="bg-indigo-50/50 px-3 py-2 border-b border-indigo-100/50 flex justify-between items-center">
                  <span className="font-bold text-indigo-900 text-sm">{item.gb}</span>
                  <span className="text-[10px] bg-white text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100">{item.category}</span>
                </div>
                <div className="p-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-slate-400 mb-0.5 scale-90 origin-left">美标 (ASTM)</p>
                    <p className="font-mono font-medium text-slate-700">{item.astm}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-0.5 scale-90 origin-left">德标 (DIN)</p>
                    <p className="font-mono font-medium text-slate-700">{item.din}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-0.5 scale-90 origin-left">日标 (JIS)</p>
                    <p className="font-mono font-medium text-slate-700">{item.jis}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderTally = () => {
    const handleSelectAll = () => {
      if (selectedTallyIds.length === tallyRecords.length) {
        setSelectedTallyIds([]);
      } else {
        setSelectedTallyIds(tallyRecords.map(r => r.id));
      }
    };

    const toggleSelect = (id: string) => {
      if (selectedTallyIds.includes(id)) {
        setSelectedTallyIds(selectedTallyIds.filter(i => i !== id));
      } else {
        setSelectedTallyIds([...selectedTallyIds, id]);
      }
    };

    const clearAll = () => {
      if (window.confirm('确定删除所有历史记录吗？此操作不可撤销')) {
        setTallyRecords([]);
        setIsManageMode(false);
        setSelectedTallyIds([]);
      }
    };

    const generateImage = (records: TallyRecord[]) => {
      if (records.length === 0) return;
      generateTallyImage(records);
      setShowTallySuccess(true);
    };

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center">
            <button onClick={() => { setActiveTool(null); setIsManageMode(false); }} className="mr-2 text-slate-400 hover:text-slate-600">
              <span className="material-icons-round">arrow_back</span>
            </button>
            <div>
              <h3 className="text-lg font-bold text-slate-800 leading-tight">电子码单</h3>
              <p className="text-[10px] text-slate-500">已保存最近 {tallyRecords.length}/50 条测算记录</p>
            </div>
          </div>
          <div className="flex gap-2">
            {isManageMode ? (
              <button onClick={() => setIsManageMode(false)} className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">完成</button>
            ) : (
              <>
                {tallyRecords.length > 0 && (
                  <>
                    <button onClick={clearAll} className="text-xs font-medium text-red-500 bg-red-50 px-3 py-1.5 rounded-full">清空</button>
                    <button onClick={() => setIsManageMode(true)} className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">批量管理</button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar -mx-2 px-2 space-y-3 pb-20">
          {tallyRecords.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <span className="material-icons-round text-4xl mb-2 opacity-50">receipt_long</span>
              <p className="text-sm">暂无码单记录</p>
              <p className="text-xs mt-1">在重量计算器中点击“加入电子码单”</p>
            </div>
          ) : (
            tallyRecords.map(item => {
              const date = new Date(item.timestamp);
              const timeStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
              
              return (
                <div 
                  key={item.id} 
                  className={`bg-slate-50 border ${selectedTallyIds.includes(item.id) ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-100'} p-3 rounded-xl flex items-center gap-3 transition-colors`}
                  onClick={() => isManageMode && toggleSelect(item.id)}
                >
                  {isManageMode && (
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selectedTallyIds.includes(item.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                      {selectedTallyIds.includes(item.id) && <span className="material-icons-round text-white text-[14px]">check</span>}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-slate-800 text-sm truncate">{item.material} <span className="text-slate-500 font-normal">/ {item.spec}</span></div>
                      {!isManageMode && (
                        <button onClick={() => generateImage([item])} className="text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded text-[10px] font-medium shrink-0 ml-2">生成单图</button>
                      )}
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-xs text-slate-600">
                        <span className="font-mono font-bold text-emerald-600">{(item.totalWeight / 1000).toFixed(3)}t</span>
                        <span className="mx-1 text-slate-300">|</span>
                        <span>{item.quantity}支</span>
                        <span className="mx-1 text-slate-300">|</span>
                        <span>{item.unitWeight.toFixed(2)}kg</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{timeStr}</div>
                    </div>
                  </div>
                  {!isManageMode && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setTallyRecords(tallyRecords.filter(r => r.id !== item.id));
                      }}
                      className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors shrink-0"
                    >
                      <span className="material-icons-round text-sm">delete_outline</span>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {isManageMode && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 ios-shadow flex items-center justify-between rounded-b-[2.5rem]">
            <div className="flex items-center gap-2" onClick={handleSelectAll}>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selectedTallyIds.length === tallyRecords.length && tallyRecords.length > 0 ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                {selectedTallyIds.length === tallyRecords.length && tallyRecords.length > 0 && <span className="material-icons-round text-white text-[14px]">check</span>}
              </div>
              <span className="text-sm text-slate-600">全选</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">已选 <strong className="text-emerald-600">{selectedTallyIds.length}</strong> 条</span>
              <button 
                onClick={() => generateImage(tallyRecords.filter(r => selectedTallyIds.includes(r.id)))}
                disabled={selectedTallyIds.length === 0}
                className="bg-emerald-500 disabled:bg-slate-300 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm"
              >
                生成长图分享
              </button>
            </div>
          </div>
        )}

        {showTallySuccess && (
          <div className="absolute inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-6 rounded-[2.5rem]">
            <div className="bg-white p-6 rounded-2xl w-full max-w-[280px] text-center shadow-xl animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-icons-round text-2xl">check_circle</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-1">码单已生成</h4>
              <p className="text-xs text-slate-500 mb-4">图片已保存，您可以直接在微信/钉钉中发送该图片给仓库或内勤。</p>
              <button 
                onClick={() => setShowTallySuccess(false)}
                className="w-full bg-slate-100 text-slate-700 py-2.5 rounded-lg font-medium text-sm hover:bg-slate-200 transition-colors"
              >
                知道了
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCuttingLoss = () => {
    const total = parseFloat(cutTotalLength) || 0;
    const piece = parseFloat(cutPieceLength) || 0;
    const kerf = parseFloat(cutKerf) || 0;
    const trim = parseFloat(cutTrim) || 0;

    let p = 0;
    let cuts = 0;
    let remaining = total;
    let loss = trim;

    if (total > 0 && piece > 0) {
      const available = Math.max(0, total - trim);
      p = Math.floor((available + kerf) / (piece + kerf));
      if (p > 0) {
        const exactMatch = Math.abs((available + kerf) % (piece + kerf)) < 0.001;
        cuts = exactMatch ? p - 1 : p;
        loss = cuts * kerf + trim;
        remaining = total - (p * piece + loss);
      } else {
        remaining = available;
      }
    }

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 h-full flex flex-col">
        <div className="flex items-center mb-6 shrink-0">
          <button onClick={() => setActiveTool(null)} className="mr-2 text-slate-400 hover:text-slate-600">
            <span className="material-icons-round">arrow_back</span>
          </button>
          <h3 className="text-lg font-bold text-slate-800">切料损耗计算</h3>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar -mx-2 px-2 space-y-4 pb-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="w-20 text-sm text-slate-600">整料长度</label>
              <input type="number" value={cutTotalLength} onChange={e => setCutTotalLength(e.target.value)} placeholder="如 6000" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
              <span className="text-sm text-slate-400 w-6">mm</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="w-20 text-sm text-slate-600">单件长度</label>
              <input type="number" value={cutPieceLength} onChange={e => setCutPieceLength(e.target.value)} placeholder="如 300" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
              <span className="text-sm text-slate-400 w-6">mm</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="w-20 text-sm text-slate-600">锯缝宽度</label>
              <input type="number" value={cutKerf} onChange={e => setCutKerf(e.target.value)} placeholder="默认 3" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
              <span className="text-sm text-slate-400 w-6">mm</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="w-20 text-sm text-slate-600">料头切除</label>
              <input type="number" value={cutTrim} onChange={e => setCutTrim(e.target.value)} placeholder="默认 0" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
              <span className="text-sm text-slate-400 w-6">mm</span>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 mt-6 border border-amber-100">
            <div className="text-center mb-4">
              <p className="text-sm text-amber-700 font-medium mb-1">实际可切件数</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black text-amber-600">{p}</span>
                <span className="text-sm font-bold text-amber-500">件</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-amber-200/50 pt-4">
              <div>
                <p className="text-xs text-amber-600/70 mb-1">料尾剩余</p>
                <p className="text-lg font-bold text-amber-800">{remaining > 0 ? remaining.toFixed(1) : '0'} <span className="text-xs font-normal">mm</span></p>
              </div>
              <div>
                <p className="text-xs text-amber-600/70 mb-1">锯切总损耗</p>
                <p className="text-lg font-bold text-amber-800">{loss > 0 ? loss.toFixed(1) : '0'} <span className="text-xs font-normal">mm</span></p>
              </div>
              <div>
                <p className="text-xs text-amber-600/70 mb-1">锯切刀数</p>
                <p className="text-lg font-bold text-amber-800">{cuts} <span className="text-xs font-normal">刀</span></p>
              </div>
              <div>
                <p className="text-xs text-amber-600/70 mb-1">材料利用率</p>
                <p className="text-lg font-bold text-amber-800">{total > 0 ? ((p * piece / total) * 100).toFixed(1) : '0.0'} <span className="text-xs font-normal">%</span></p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-[10px] text-slate-400 flex items-start gap-1">
            <span className="material-icons-round text-[12px] mt-0.5">info</span>
            <p>计算逻辑：每切下一件材料，都会消耗一个锯缝宽度。如果最后剩余的材料刚好等于单件长度，则最后一刀不需要锯切。</p>
          </div>
        </div>
      </div>
    );
  };

  const renderCompositions = () => {
    const filteredComps = compositionsData.filter(c => 
      c.grade.toLowerCase().includes(compSearch.toLowerCase()) || 
      c.standard.toLowerCase().includes(compSearch.toLowerCase())
    );

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 h-full flex flex-col">
        <div className="flex items-center mb-6 shrink-0">
          <button onClick={() => setActiveTool(null)} className="mr-2 text-slate-400 hover:text-slate-600">
            <span className="material-icons-round">arrow_back</span>
          </button>
          <h3 className="text-lg font-bold text-slate-800">成分速查</h3>
        </div>

        <div className="mb-4 shrink-0">
          <div className="relative">
            <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input 
              type="text" 
              value={compSearch}
              onChange={e => setCompSearch(e.target.value)}
              placeholder="搜索牌号或标准 (如 40Cr, GB/T 3077)" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-cyan-400 text-slate-700"
            />
            {compSearch && (
              <button 
                onClick={() => setCompSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <span className="material-icons-round text-sm">close</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar -mx-2 px-2 pb-4">
          <div className="overflow-x-auto hide-scrollbar rounded-xl border border-slate-100 bg-white">
            <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                  <th className="p-3 font-bold sticky left-0 bg-slate-50 z-10 shadow-[1px_0_0_0_#f1f5f9]">牌号</th>
                  <th className="p-3 font-bold">标准</th>
                  <th className="p-3 font-bold text-cyan-700 bg-cyan-50/30">C</th>
                  <th className="p-3 font-bold text-cyan-700 bg-cyan-50/30">Si</th>
                  <th className="p-3 font-bold text-cyan-700 bg-cyan-50/30">Mn</th>
                  <th className="p-3 font-bold text-cyan-700 bg-cyan-50/30">Cr</th>
                  <th className="p-3 font-bold text-cyan-700 bg-cyan-50/30">Mo</th>
                  <th className="p-3 font-bold">Ni</th>
                  <th className="p-3 font-bold">V</th>
                  <th className="p-3 font-bold">W</th>
                  <th className="p-3 font-bold text-slate-400">P</th>
                  <th className="p-3 font-bold text-slate-400">S</th>
                  <th className="p-3 font-bold">其他</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComps.length > 0 ? (
                  filteredComps.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-bold text-slate-800 sticky left-0 bg-white shadow-[1px_0_0_0_#f1f5f9]">{c.grade}</td>
                      <td className="p-3 text-slate-500 text-[10px]">{c.standard}</td>
                      <td className="p-3 font-mono text-cyan-900 bg-cyan-50/10">{c.C}</td>
                      <td className="p-3 font-mono text-cyan-900 bg-cyan-50/10">{c.Si}</td>
                      <td className="p-3 font-mono text-cyan-900 bg-cyan-50/10">{c.Mn}</td>
                      <td className="p-3 font-mono text-cyan-900 bg-cyan-50/10">{c.Cr}</td>
                      <td className="p-3 font-mono text-cyan-900 bg-cyan-50/10">{c.Mo}</td>
                      <td className="p-3 font-mono text-slate-600">{c.Ni}</td>
                      <td className="p-3 font-mono text-slate-600">{c.V}</td>
                      <td className="p-3 font-mono text-slate-600">{c.W}</td>
                      <td className="p-3 font-mono text-slate-400">{c.P}</td>
                      <td className="p-3 font-mono text-slate-400">{c.S}</td>
                      <td className="p-3 font-mono text-slate-500 text-[10px]">{c.other || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={13} className="p-8 text-center text-slate-400">
                      未找到匹配的牌号或标准
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-[10px] text-slate-400 flex items-start gap-1">
            <span className="material-icons-round text-[12px] mt-0.5">info</span>
            <p>表格支持左右滑动查看完整元素。高亮列为核心合金元素。数据仅供参考，请以实际质保书为准。</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`absolute inset-0 z-50 flex items-center justify-center p-6 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-md" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-sm ${['compare', 'favorites', 'equivalents', 'tally', 'compositions', 'cutting'].includes(activeTool || '') ? 'h-[80vh]' : ''} bg-white/95 p-6 rounded-[2.5rem] ios-shadow border border-white/50 transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'} flex flex-col`}>
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-slate-400 hover:text-slate-600 transition-colors z-10"
        >
          <span className="material-icons-round">close</span>
        </button>
        
        {activeTool === 'weight' && renderWeightCalculator()}
        {activeTool === 'favorites' && renderFavorites()}
        {activeTool === 'compare' && renderComparison()}
        {activeTool === 'heatTreatment' && renderHeatTreatment()}
        {activeTool === 'unit' && renderUnitConverter()}
        {activeTool === 'equivalents' && renderEquivalents()}
        {activeTool === 'tally' && renderTally()}
        {activeTool === 'compositions' && renderCompositions()}
        {activeTool === 'cutting' && renderCuttingLoss()}
        {!activeTool && renderToolboxMenu()}

        {toastMessage && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-in fade-in slide-in-from-bottom-4 z-50">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
