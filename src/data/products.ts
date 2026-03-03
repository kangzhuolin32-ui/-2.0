export interface Product {
  id: string;
  name: string;
  type: string;
  tags: string[];
  density: number;
  applications: string;
  composition: Record<string, string>;
  heatTreatment: string;
  specifications: string;
  machinability: string;
  advice: string;
  precautions: string;
  radarData: {
    hardness: number;
    toughness: number;
    yieldStrength: number;
    hardenability: number;
    wearResistance: number;
  };
}

export const products = [
  { id: 'sus440c', name: 'SUS440C', type: '不锈钢', tags: ['高硬度', '耐腐蚀', '马氏体', '轴承', '模具'], density: 7.75 },
  { id: '4340', name: '4340', type: '合金钢', tags: ['高强度', '高韧性', '抗疲劳', '机械', '汽车'], density: 7.85 },
  { id: '40crnimo', name: '40CrNiMo', type: '合金钢', tags: ['综合力学性能好', '淬透性高', '机械', '汽车'], density: 7.85 },
  { id: '38crmoal', name: '38CrMoAL', type: '合金钢', tags: ['高级渗氮钢', '耐磨性高', '机械', '汽车'], density: 7.85 },
  { id: 's7', name: 'S7（5Cr3Mn1SiMo1V）', type: '模具钢', tags: ['抗冲击', '耐磨', '高韧性', '模具'], density: 7.83 },
  { id: 'a2', name: 'A2（Cr5Mo1V）', type: '模具钢', tags: ['冷作模具', '微变形', '高耐磨', '模具'], density: 7.86 },
  { id: '16mncr5', name: '16MnCr5', type: '合金钢', tags: ['表面硬化', '齿轮钢', '汽车', '机械'], density: 7.85 },
  { id: 'gcr15', name: 'GCr15', type: '轴承钢', tags: ['高碳铬', '耐磨', '接触疲劳强度高', '轴承', '机械'], density: 7.81 },
  { id: 't10a', name: 'T10A', type: '工具钢', tags: ['碳素工具钢', '硬度高', '韧性适中', '模具', '机械'], density: 7.85 },
  { id: '20crmnti', name: '20CrMnTi', type: '合金钢', tags: ['渗碳钢', '齿轮专用', '汽车', '机械'], density: 7.85 },
  { id: '65mn', name: '65Mn', type: '弹簧钢', tags: ['高弹性', '淬透性好', '汽车', '机械'], density: 7.85 },
  { id: '60si2mn', name: '60Si2Mn', type: '弹簧钢', tags: ['抗疲劳', '硅锰弹簧钢', '汽车', '机械'], density: 7.85 },
  { id: '40cr', name: '40Cr', type: '合金钢', tags: ['调质钢', '机械零件', '机械', '汽车'], density: 7.85 },
  { id: '25crmo', name: '25CrMo', type: '合金钢', tags: ['高强度', '焊接性能好', '汽车', '机械'], density: 7.85 },
  { id: '35crmo', name: '35CrMo', type: '合金钢', tags: ['耐高温', '静力强度高', '汽车', '机械'], density: 7.85 },
  { id: '42crmo', name: '42CrMo', type: '合金钢', tags: ['高强度', '高韧性', '调质', '机械', '汽车'], density: 7.85 },
  { id: '5crnimo', name: '5CrNiMo', type: '模具钢', tags: ['热作模具', '高韧性', '模具'], density: 7.85 },
  { id: '5crmnmo', name: '5CrMnMo', type: '模具钢', tags: ['热作模具', '耐热疲劳', '模具'], density: 7.85 },
  { id: '20mn23alv', name: '20Mn23ALV', type: '无磁钢', tags: ['无磁性', '高强度', '机械'], density: 7.89 },
  { id: 'suj2', name: 'SuJ2', type: '轴承钢', tags: ['高碳铬', '耐磨性极佳', '轴承', '机械'], density: 7.81 },
  { id: 'q355b', name: 'Q355B', type: '低合金钢', tags: ['结构钢', '综合性能好', '机械'], density: 7.85 },
  { id: '40crni2mo', name: '40CrNi2Mo', type: '合金钢', tags: ['高强度', '高韧性', '机械', '汽车'], density: 7.85 },
  { id: '30crmnsini2', name: '30CrMnSiNi2A', type: '合金钢', tags: ['超高强度', '航空航天', '机械'], density: 7.85 },
  { id: '9cr18mo', name: '9Cr18Mo', type: '不锈钢', tags: ['高硬度', '防锈', '马氏体', '轴承', '模具'], density: 7.70 },
];

export const getProductDetails = (id: string): Product | null => {
  const base = products.find(p => p.id === id);
  if (!base) return null;
  
  // Generate distinct mock composition based on type or ID
  let comp: Record<string, string> = {};
  let radar = { hardness: 50, toughness: 50, yieldStrength: 50, hardenability: 50, wearResistance: 50 };
  
  if (base.type === '不锈钢') {
    comp = { 'C': '0.95~1.20%', 'Si': '≤1.00%', 'Mn': '≤1.00%', 'Cr': '16.0~18.0%', 'Mo': '0.75%' };
    radar = { hardness: 85, toughness: 40, yieldStrength: 75, hardenability: 90, wearResistance: 80 };
  } else if (base.type === '模具钢') {
    comp = { 'C': '0.35~1.50%', 'Si': '0.20~1.20%', 'Mn': '0.20~0.60%', 'Cr': '1.0~5.0%', 'Mo': '0.5~1.5%', 'V': '0.2~1.0%' };
    radar = { hardness: 90, toughness: 60, yieldStrength: 85, hardenability: 95, wearResistance: 90 };
  } else if (base.type === '轴承钢') {
    comp = { 'C': '0.95~1.05%', 'Si': '0.15~0.35%', 'Mn': '0.25~0.45%', 'Cr': '1.40~1.65%' };
    radar = { hardness: 95, toughness: 30, yieldStrength: 80, hardenability: 85, wearResistance: 95 };
  } else if (base.type === '弹簧钢') {
    comp = { 'C': '0.55~0.65%', 'Si': '1.50~2.00%', 'Mn': '0.70~1.00%', 'Cr': '≤0.35%', 'Ni': '≤0.35%' };
    radar = { hardness: 75, toughness: 85, yieldStrength: 95, hardenability: 70, wearResistance: 60 };
  } else {
    // 合金钢, 低合金钢, 无磁钢, 工具钢
    comp = {
      'C': '0.35~0.45%',
      'Si': '0.15~0.35%',
      'Mn': '0.40~0.70%',
      'Cr': '0.80~1.20%',
      'Mo': '0.15~0.25%',
      'Ni': '≤0.30%'
    };
    radar = { hardness: 65, toughness: 80, yieldStrength: 70, hardenability: 75, wearResistance: 55 };
  }

  // Specific overrides for realism
  let ht = '通常采用淬火+回火工艺。具体工艺需根据零件尺寸和性能要求调整。';
  
  if (id === '4340') {
    comp = { 'C': '0.38~0.43%', 'Si': '0.15~0.35%', 'Mn': '0.60~0.80%', 'Cr': '0.70~0.90%', 'Mo': '0.20~0.30%', 'Ni': '1.65~2.00%' };
    ht = '调质处理：淬火830-860℃油冷，回火540-680℃水冷或油冷。要求高韧性时采用高温回火。';
    radar = { hardness: 70, toughness: 95, yieldStrength: 85, hardenability: 90, wearResistance: 65 };
  }
  if (id === 'sus440c') {
    comp = { 'C': '0.95~1.20%', 'Si': '≤1.00%', 'Mn': '≤1.00%', 'Cr': '16.0~18.0%', 'Mo': '0.75%' };
    ht = '退火：800-920℃缓冷；淬火：1010-1070℃油冷；回火：100-180℃快冷。淬火后硬度可达HRC58以上。';
    radar = { hardness: 90, toughness: 35, yieldStrength: 80, hardenability: 95, wearResistance: 85 };
  }
  if (id === 's7') {
    comp = { 'C': '0.45~0.55%', 'Si': '0.20~1.00%', 'Mn': '0.20~0.90%', 'Cr': '3.00~3.50%', 'Mo': '1.30~1.80%', 'V': '0.20~0.30%' };
    ht = '淬火：925-950℃空冷或油冷；回火：200-400℃（冷作模具）或400-650℃（热作模具）。';
    radar = { hardness: 85, toughness: 90, yieldStrength: 80, hardenability: 95, wearResistance: 75 };
  }
  if (id === '16mncr5') {
    comp = { 'C': '0.14~0.19%', 'Si': '≤0.40%', 'Mn': '1.00~1.30%', 'Cr': '0.80~1.10%', 'S': '0.01~0.035%' };
    ht = '渗碳：880-980℃；淬火：780-820℃水冷或油冷；回火：150-200℃。表面硬度高，心部韧性好。';
    radar = { hardness: 80, toughness: 85, yieldStrength: 65, hardenability: 70, wearResistance: 85 };
  }
  if (id === 't10a') {
    comp = { 'C': '0.95~1.04%', 'Si': '≤0.35%', 'Mn': '≤0.40%', 'P': '≤0.020%', 'S': '≤0.020%' };
    ht = '淬火：760-780℃水冷（或水淬油冷）；回火：160-180℃。淬火后硬度HRC62左右。';
    radar = { hardness: 95, toughness: 25, yieldStrength: 75, hardenability: 40, wearResistance: 90 };
  }
  if (id === 'q355b') {
    comp = { 'C': '≤0.20%', 'Si': '≤0.50%', 'Mn': '≤1.70%', 'P': '≤0.035%', 'S': '≤0.035%' };
    ht = '通常以热轧、控轧或正火状态交货使用，一般不进行特殊的淬火回火处理。';
    radar = { hardness: 40, toughness: 95, yieldStrength: 55, hardenability: 20, wearResistance: 30 };
  }
  if (id === 'a2') {
    ht = '淬火：950-980℃空冷或油冷；回火：150-200℃或500-520℃（二次硬化）。';
    radar = { hardness: 92, toughness: 50, yieldStrength: 88, hardenability: 98, wearResistance: 95 };
  }
  if (id === 'gcr15' || id === 'suj2') {
    ht = '球化退火：790-810℃；淬火：830-850℃油冷；回火：150-160℃。要求高硬度和高耐磨性。';
    radar = { hardness: 96, toughness: 30, yieldStrength: 85, hardenability: 85, wearResistance: 98 };
  }
  if (id === '65mn' || id === '60si2mn') {
    ht = '淬火：830-870℃油冷；中温回火：400-500℃。以获得高弹性极限和屈强比。';
    radar = { hardness: 75, toughness: 80, yieldStrength: 95, hardenability: 65, wearResistance: 65 };
  }
  if (id === '40cr' || id === '42crmo' || id === '35crmo') {
    ht = '调质处理：淬火840-860℃油冷或水冷，回火500-600℃水冷或油冷。以获得良好的综合力学性能。';
    radar = { hardness: 65, toughness: 85, yieldStrength: 80, hardenability: 85, wearResistance: 60 };
  }
  if (id === '20crmnti') {
    ht = '渗碳：900-950℃；淬火：820-850℃油冷；回火：150-200℃。齿轮常用热处理工艺。';
    radar = { hardness: 85, toughness: 80, yieldStrength: 70, hardenability: 75, wearResistance: 88 };
  }
  if (id === '5crnimo' || id === '5crmnmo') {
    ht = '淬火：820-860℃油冷；回火：450-550℃。适用于热锻模具，要求红硬性和耐热疲劳性。';
    radar = { hardness: 80, toughness: 85, yieldStrength: 75, hardenability: 90, wearResistance: 75 };
  }
  if (id === '9cr18mo') {
    ht = '退火：800-900℃缓冷；淬火：1000-1050℃油冷；回火：200-300℃。高耐磨防锈。';
    radar = { hardness: 92, toughness: 30, yieldStrength: 82, hardenability: 95, wearResistance: 90 };
  }
  if (id === '30crmnsini2') {
    ht = '等温淬火或淬火+低温回火：淬火890-910℃油冷，回火250-300℃。超高强度钢标准工艺。';
    radar = { hardness: 85, toughness: 75, yieldStrength: 98, hardenability: 95, wearResistance: 70 };
  }

  return {
    ...base,
    applications: `广泛应用于制造高负荷、高速度、耐磨损的精密机械零件，特别适合${base.type}相关的工业场景。`,
    composition: comp,
    heatTreatment: ht,
    specifications: '圆钢：Φ10mm - Φ300mm\n板材：厚度 10mm - 150mm\n锻件：按客户图纸定制\n表面状态：黑皮、车光、磨光',
    machinability: '在退火状态下具有良好的切削加工性能。淬火回火后硬度增加，切削难度相应增大。',
    advice: `适用于要求特定性能的${base.type}零件。若对耐腐蚀性有较高要求，建议选择不锈钢系列。`,
    precautions: '1. 锻造后需进行缓冷以防止白点产生。\n2. 焊接性能较差，焊前需预热，焊后需进行消除应力退火。\n3. 热处理过程中注意控制脱碳层深度。',
    radarData: radar
  };
}
