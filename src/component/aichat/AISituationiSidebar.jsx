import React from "react";

const AISituationSidebar = ({ situations, onSelectSituation }) => {
  return (
    <div className="w-80 bg-white border-r flex flex-col shrink-0">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800 mb-2">AI 말연습장</h2>
        <p className="text-sm text-blue-500 mb-4">부담 없이 연습해보세요</p>
        <button className="w-full bg-gradient-to-r from-green-400 to-blue-400 text-white py-2.5 rounded-lg font-medium shadow-sm hover:opacity-90 transition-opacity">
          무제한 연습 가능
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-lg">💡</span> 상황 선택
        </h3>
        <div className="space-y-3">
          {situations.map((sit) => (
            <div
              key={sit.id}
              onClick={() => onSelectSituation(sit.id)}
              className="p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-green-300 hover:shadow-md cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl group-hover:scale-110 transition-transform">{sit.icon}</span>
                <h4 className="font-bold text-gray-800">{sit.title}</h4>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{sit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AISituationSidebar;