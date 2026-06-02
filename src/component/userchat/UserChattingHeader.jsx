import React, { useState } from "react";
import { HelpCircle, LogOut, Hash } from "lucide-react";

// 도움말 내용 모달 (헤더 내부에 포함)
const HelpModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">💬 채팅 도움말</h2>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex gap-2">
            <span className="text-blue-400 font-bold shrink-0">01.</span>
            {""}
            매칭된 상대방과 정해진 횟수만큼 대화를 나눌 수 있어요. (기본 40턴)
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400 font-bold shrink-0">02.</span>
            {""}
            연속으로 3번까지만 메시지를 보낼 수 있어요. 상대방의 답변을
            기다려주세요.
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400 font-bold shrink-0">03.</span>
            {""}
            대화가 끝나면 연장 여부를 선택할 수 있어요. (23턴)
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400 font-bold shrink-0">04.</span>
            {""}
            🎯 키워드 미션을 대화 중 자연스럽게 사용해보세요! 일정 횟수 성공 시
            뱃지를 획득해요.
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400 font-bold shrink-0">05.</span>
            {""}
            🎖️ 채팅 후기를 통해서도 뱃지를 획득할 수 있어요.
          </li>
        </ul>
        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );
};

// 강제 종료 확인 모달 (헤더 내부에 포함)
const ForceEndModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          채팅을 종료할까요?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          대화를 중간에 강제 종료하면 온도가 3도 감소합니다. 정말
          종료하시겠어요?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            계속 대화하기
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            종료하기
          </button>
        </div>
      </div>
    </div>
  );
};

const UserChattingHeader = ({ topic, onForceEnd }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [showForceEnd, setShowForceEnd] = useState(false);

  const tooltipStyle =
    "absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] py-1 px-2 rounded -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-10";

  const handleConfirmEnd = () => {
    setShowForceEnd(false);
    if (onForceEnd) onForceEnd();
  };

  return (
    <>
      <div className="bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
            <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-gray-400">
              현재 채팅 주제
            </p>
            <h3 className="font-bold text-sm sm:text-base text-gray-800 leading-tight">
              {topic || "주제 없음"}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative group">
            <button
              onClick={() => setShowHelp(true)}
              className="p-2.5 sm:p-3 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
            >
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className={tooltipStyle}>도움말 보기</span>
          </div>

          <div className="relative group">
            <button
              onClick={() => setShowForceEnd(true)}
              className="p-2.5 sm:p-3 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className={tooltipStyle}>채팅 종료하기</span>
          </div>
        </div>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {showForceEnd && (
        <ForceEndModal
          onConfirm={handleConfirmEnd}
          onCancel={() => setShowForceEnd(false)}
        />
      )}
    </>
  );
};

export default UserChattingHeader;
