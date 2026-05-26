import React from "react";

const ChattingExtendModal = ({ isOpen, onClose, onExtend }) => {



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-3 text-gray-800">
          대화가 종료되었어요! 🤗
        </h2>
        <p className="text-center text-gray-600 mb-2 text-sm sm:text-base">
          대화가 즐거우셨나요?
        </p>
        <p className="text-center text-gray-500 mb-6 text-xs sm:text-sm">
          대화를 더 연장하시겠습니까? <br/>상대방도 연장을 원할 경우 25턴 연장됩니다.
        </p>
        {/* 하단 액션 버튼 */}
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            종료하기
          </button>
          <button
            onClick={() => onExtend()} className="flex-1 px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors">
            연장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChattingExtendModal;