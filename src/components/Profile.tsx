export default function Profile() {
  return (
    <div className="px-6 pt-12">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm">
          <span className="material-icons-round text-primary text-4xl">person_outline</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">必富特钢助手</h1>
          <p className="text-sm text-gray-500">昆山必富金属制品有限公司</p>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        <button className="w-full bg-white p-5 rounded-2xl flex items-center ios-shadow border border-gray-50 active:scale-[0.98] transition-transform">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mr-4">
            <span className="material-icons-round text-blue-500">phone_in_talk</span>
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-900">联系销售</p>
            <p className="text-sm text-gray-500">17815618410</p>
          </div>
          <span className="material-icons-round text-gray-300">chevron_right</span>
        </button>

        <button className="w-full bg-white p-5 rounded-2xl flex items-center ios-shadow border border-gray-50 active:scale-[0.98] transition-transform">
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mr-4">
            <span className="material-icons-round text-primary">chat_bubble_outline</span>
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">在线咨询</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">微信同号</span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">快速响应 • 微信同手机号</p>
          </div>
          <span className="material-icons-round text-gray-300">chevron_right</span>
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">企业信息</h2>
        <div className="bg-white rounded-2xl p-6 ios-shadow border border-gray-50">
          <div className="flex items-start mb-8">
            <span className="material-icons-round text-orange-400 mt-0.5 mr-4">workspace_premium</span>
            <div>
              <p className="font-semibold text-gray-900 mb-1">公司资质</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                拥有完整的原材料质检报告与ISO质量管理体系认证，长期服务于国内外一线精密制造厂商。
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <span className="material-icons-round text-red-400 mt-0.5 mr-4">location_on</span>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 mb-1">地址导航</p>
              <p className="text-sm text-gray-500 mb-4">江苏省苏州市昆山市君合产业园</p>
              
              <div className="relative h-32 w-full bg-slate-100 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 opacity-40">
                  <svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" width="100%">
                    <path className="text-gray-400" d="M0 20 L100 20 M20 0 L20 100 M60 0 L60 100 M0 70 L100 70" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
                  </svg>
                </div>
                <div className="relative bg-white p-2 rounded-lg shadow-md flex flex-col items-center">
                  <span className="material-icons-round text-blue-500 text-sm">navigation</span>
                  <span className="text-[10px] font-bold text-blue-600 mt-1" style={{ writingMode: 'vertical-rl' }}>查看地图</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center space-x-2 text-gray-400 pb-8">
        <span className="material-icons-round text-xs">verified_user</span>
        <span className="text-xs">官方正品 保障</span>
      </div>
    </div>
  );
}
