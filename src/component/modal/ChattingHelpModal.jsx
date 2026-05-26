import React from "react";

const CommonHelpModal = ({ isOpen, onClose, type = "AI" }) => {
  if (!isOpen) return null;

  const helpContent = {
    AI: {
      title: "AI 코칭 가이드",
      subTitle: "AI와 함께 말하기 습관을 길러보세요",
      steps: [
        { icon: "🌱", title: "상황 선택", desc: "원하는 상황을 선택하여 대화를 시작하세요." },
        { icon: "🪴", title: "AI 코칭", desc: "AI 코치가 실시간으로 대화를 이끌어줍니다." },
        { icon: "🌿", title: "키워드 활용", desc: "부여된 키워드를 활용해 풍성하게 대화해보세요." },
        { icon: "🌳", title: "감정 피드백", desc: "대화 종료 후 느낀 감정을 솔직하게 남겨주세요." },
      ],
      bottomText: "AI와의 대화는 여러분의 말하기 습관 개선에 큰 도움이 됩니다. 편안하게 연습을 시작해보세요!",
      themeColor: "bg-green-400 hover:bg-green-500 shadow-green-100 text-green-700 bg-green-50"
    },
    USER: {
      title: "USER 채팅 가이드",
      subTitle: "서로 공감하며 대화의 즐거움을 찾아보세요",
      steps: [
        { icon: "💬", title: "10턴 익명 채팅", desc: "부담 없는 짧은 대화로 말문을 틔워보세요." },
        { icon: "🎯", title: "미션 & 키워드", desc: "매일 새로운 미션과 키워드로 연습해요." },
        { icon: "💝", title: "감정 태그 교환", desc: "대화 후 감정을 나누며 공감해요." },
        { icon: "🤖", title: "AI 피드백", desc: "AI가 맞춤 피드백으로 실력을 키워줘요." },
      ],
      bottomText: "실제 사람과 대화하며 실전 감각을 익힐 수 있습니다. 매너 있는 대화를 유지해 주세요!",
      themeColor: "bg-blue-400 hover:bg-blue-500 shadow-blue-100 text-blue-700 bg-blue-50"
    }
  };

  const currentContent = helpContent[type];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200 text-center">
        
        {/* 상단 헤더 섹션 */}
        <div className="flex flex-col items-center mb-8">
          <div className={`w-16 h-16 ${type === "AI" ? "bg-green-50" : "bg-blue-50"} rounded-full flex items-center justify-center text-3xl mb-4`}>
            💡
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{currentContent.title}</h2>
          <p className="text-sm text-gray-400 mt-1">{currentContent.subTitle}</p>
        </div>

        {/* 단계별 리스트 섹션 */}
        <div className="space-y-5 mb-8 text-left">
          {currentContent.steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <span className="text-2xl bg-gray-50 p-2 rounded-xl">{step.icon}</span>
              <div className="flex flex-col">
                <span className="font-bold text-gray-700 text-sm">{step.title}</span>
                <span className="text-xs text-gray-500 leading-relaxed">{step.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 강조 텍스트 */}
        <div className={`${type === "AI" ? "bg-green-50" : "bg-blue-50"} p-4 rounded-2xl mb-8`}>
          <p className={`text-[11px] ${type === "AI" ? "text-green-700" : "text-blue-700"} leading-tight`}>
            {currentContent.bottomText}
          </p>
        </div>

        {/* 버튼 */}
        <button 
          onClick={onClose} 
          className={`w-full ${type === "AI" ? "bg-green-400 hover:bg-green-500 shadow-green-100" : "bg-blue-400 hover:bg-blue-500 shadow-blue-100"} text-white py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95`}
        >
          시작하기
        </button>
      </div>
    </div>
  );
};

export default CommonHelpModal;