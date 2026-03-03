import { getProductDetails } from '../data/products';
import { ReactNode } from 'react';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
}

export default function ProductDetail({ productId, onBack }: ProductDetailProps) {
  const product = getProductDetails(productId);

  if (!product) return <div className="p-6">Product not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 active:scale-95 transition-transform">
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-800 flex-1 truncate">{product.name}</h1>
      </div>

      <div className="px-4 pt-6 space-y-6">
        {/* Title & Tags */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
              {product.type}
            </span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">{product.name}</h2>
          <div className="flex flex-wrap gap-2">
            {product.tags.map(tag => (
              <span key={tag} className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 用途 */}
        <Section title="用途" icon="build_circle" color="text-blue-500" bg="bg-blue-50">
          <p className="text-sm text-slate-600 leading-relaxed">{product.applications}</p>
        </Section>

        {/* 成分 */}
        <Section title="化学成分" icon="science" color="text-purple-500" bg="bg-purple-50">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(product.composition).map(([element, value]) => (
              <div key={element} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-xl">
                <span className="font-bold text-slate-700">{element}</span>
                <span className="text-sm text-slate-500 font-mono">{value}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* 热处理工艺 */}
        <Section title="热处理工艺" icon="local_fire_department" color="text-orange-500" bg="bg-orange-50">
          <p className="text-sm text-slate-600 leading-relaxed">{product.heatTreatment}</p>
        </Section>

        {/* 供应规格 */}
        <Section title="供应规格" icon="inventory_2" color="text-teal-500" bg="bg-teal-50">
          <div className="space-y-2">
            {product.specifications.split('\n').map((line, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="material-icons-round text-teal-500 text-sm mt-0.5">check_circle</span>
                <span className="text-sm text-slate-600">{line}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* 加工性能 */}
        <Section title="加工性能" icon="precision_manufacturing" color="text-indigo-500" bg="bg-indigo-50">
          <p className="text-sm text-slate-600 leading-relaxed">{product.machinability}</p>
        </Section>

        {/* 选材建议 */}
        <Section title="选材建议" icon="lightbulb" color="text-amber-500" bg="bg-amber-50">
          <p className="text-sm text-slate-600 leading-relaxed">{product.advice}</p>
        </Section>

        {/* 注意事项 */}
        <Section title="注意事项" icon="warning" color="text-red-500" bg="bg-red-50">
          <div className="space-y-2">
            {product.precautions.split('\n').map((line, i) => (
              <div key={i} className="flex items-start gap-2 bg-red-50/50 p-3 rounded-xl">
                <span className="text-sm text-slate-700">{line}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, icon, color, bg, children }: { title: string, icon: string, color: string, bg: string, children: ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-full ${bg} ${color} flex items-center justify-center`}>
          <span className="material-icons-round text-sm">{icon}</span>
        </div>
        <h3 className="font-bold text-slate-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}
