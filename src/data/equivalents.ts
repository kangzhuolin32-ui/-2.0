export interface SteelEquivalent {
  id: string;
  category: string;
  gb: string;
  astm: string;
  din: string;
  jis: string;
}

export const equivalentsData: SteelEquivalent[] = [
  { id: '1', category: '不锈钢', gb: '9Cr18Mo', astm: '440C', din: 'X105CrMo17 / 1.4125', jis: 'SUS440C' },
  { id: '2', category: '合金钢', gb: '40CrNiMoA', astm: '4340', din: '36CrNiMo4 / 1.6511', jis: 'SNCM439' },
  { id: '3', category: '合金钢', gb: '40CrNiMo', astm: '4340', din: '36CrNiMo4 / 1.6511', jis: 'SNCM439' },
  { id: '4', category: '合金钢', gb: '38CrMoAl', astm: 'Nitramalloy 135M', din: '41CrAlMo7 / 1.8509', jis: 'SACM645' },
  { id: '5', category: '模具钢', gb: '5Cr3Mn1SiMo1V', astm: 'S7', din: '50CrMoV13-14 / 1.2355', jis: '-' },
  { id: '6', category: '模具钢', gb: 'Cr5Mo1V', astm: 'A2', din: 'X100CrMoV5 / 1.2363', jis: 'SKD12' },
  { id: '7', category: '合金钢', gb: '16MnCr5', astm: '5115', din: '16MnCr5 / 1.7131', jis: '-' },
  { id: '8', category: '轴承钢', gb: 'GCr15', astm: '52100', din: '100Cr6 / 1.3505', jis: 'SUJ2' },
  { id: '9', category: '工具钢', gb: 'T10A', astm: 'W1-9 1/2', din: 'C105W1 / 1.1545', jis: 'SK105' },
  { id: '10', category: '合金钢', gb: '20CrMnTi', astm: '5120', din: '20MnCr5 / 1.7147', jis: 'SCr420' },
  { id: '11', category: '弹簧钢', gb: '65Mn', astm: '1566', din: '66Mn4', jis: 'SUP3' },
  { id: '12', category: '弹簧钢', gb: '60Si2Mn', astm: '9260', din: '60SiCr7', jis: 'SUP6' },
  { id: '13', category: '合金钢', gb: '40Cr', astm: '5140', din: '41Cr4 / 1.7035', jis: 'SCr440' },
  { id: '14', category: '合金钢', gb: '25CrMo', astm: '4130', din: '25CrMo4 / 1.7218', jis: 'SCM430' },
  { id: '15', category: '合金钢', gb: '35CrMo', astm: '4135', din: '34CrMo4 / 1.7220', jis: 'SCM435' },
  { id: '16', category: '合金钢', gb: '42CrMo', astm: '4140', din: '42CrMo4 / 1.7225', jis: 'SCM440' },
  { id: '17', category: '模具钢', gb: '5CrNiMo', astm: 'L6', din: '55NiCrMoV7 / 1.2714', jis: 'SKT4' },
  { id: '18', category: '模具钢', gb: '5CrMnMo', astm: '-', din: '-', jis: 'SKT5' },
  { id: '19', category: '无磁钢', gb: '20Mn23AlV', astm: '-', din: '-', jis: '-' },
  { id: '20', category: '低合金钢', gb: 'Q355B', astm: 'A572 Gr.50', din: 'S355JR / 1.0045', jis: 'SM490A' },
  { id: '21', category: '合金钢', gb: '40CrNi2Mo', astm: '4340', din: '36CrNiMo4 / 1.6511', jis: 'SNCM439' },
  { id: '22', category: '合金钢', gb: '30CrMnSiNi2A', astm: '300M', din: '-', jis: '-' }
];
