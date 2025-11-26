const StatsCard = ({ title, value, icon, color, badge }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      {badge && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badge.className}`}>
          {badge.text}
        </span>
      )}
    </div>
    <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

export default StatsCard;
