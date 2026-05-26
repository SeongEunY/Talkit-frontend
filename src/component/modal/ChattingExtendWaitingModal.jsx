import React from "react";

const ChattingWaitModal = ({ isOpen, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl">
        {/* 로딩 애니메이션 아이콘 */}
        <div className="flex justify-center mb-6">
          <div className="relative flex items-center justify-center">
            <div className="animate-ping absolute h-12 w-12 rounded-full bg-blue-400 opacity-20"></div>
            <div className="relative rounded-full h-12 w-12 bg-blue-500 flex items-center justify-center text-white text-2xl">
              ⌛
            </div>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-center mb-3 text-gray-800">
          상대방의 응답을 기다리는 중...
        </h2>
        
        <p className="text-center text-gray-600 mb-2 text-sm sm:text-base">
          잠시만 기다려 주세요!
        </p>
        
        <p className="text-center text-gray-500 mb-8 text-xs sm:text-sm">
          상대방도 연장에 동의하면 <br/>
          대화가 자동으로 다시 시작됩니다.
        </p>

        {/* 하단 취소 버튼 */}
        <div className="flex justify-center">
          <button
            onClick={onCancel}
            className="w-full px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium text-gray-500 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            기다리기 취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChattingWaitModal;