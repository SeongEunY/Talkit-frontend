import React, {useState} from "react";
import axios from "axios";

const AIChatEndModal = ({ isOpen, onClose, roomId }) => {
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const emotions = [
    { text: "정말 즐거웠어요", emoji: "🥰" },
    { text: "편안했어요", emoji: "☺️" },
    { text: "평범했어요", emoji: "😐" },
    { text: "아쉬웠어요", emoji: "😔" },
    { text: "불편했어요", emoji: "😣" },
  ];

  const toggleEmotion = (emotionText) => {
    setSelectedEmotion((prev) => (prev === emotionText ? null : emotionText));
  };

  const handleSubmit = async () => {
    if (!selectedEmotion) {
      alert("상대방에 대한 감정을 선택해주세요!");
      return;
    }

    try {
      // 백엔드 컨트롤러 경로: /api/user-chat/room/{roomId}/review
      await axios.post(`/api/user-chat/room/${roomId}/review`, {
        emotion: selectedEmotion, // ReviewRequestDto의 emotion 필드로 들어감
      });

      alert("소중한 후기 감사합니다. 온도가 반영되었습니다!");
      onClose(); // 모달 닫기
      window.location.href = "/mypage"; // 혹은 목록으로 이동
    } catch (error) {
      console.error("후기 저장 실패:", error);
      alert("후기 저장 중 오류가 발생했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-3 text-gray-800">
          대화가 끝났어요!
        </h2>
        <p className="text-center text-gray-600 mb-2 text-sm sm:text-base">
          상대방과의 대화는 어떠셨나요?
        </p>
        <p className="text-center text-gray-500 mb-6 text-xs sm:text-sm">
          솔직한 감정을 선택해주세요.
        </p>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
          {emotions.map((emotion, idx) => (
            <button
              key={idx}
              onClick={() => toggleEmotion(emotion.text)}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                selectedEmotion===emotion.text
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {emotion.text} {emotion.emoji}
            </button>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          {/* 돌아가기 (취소) 버튼 */}
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            더 연습할래요
          </button>

          {/* 진짜 종료 버튼 */}
          <button
            onClick={handleSubmit}
            className="flex-1 py-4 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-100"
          >
            대화 종료
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatEndModal;