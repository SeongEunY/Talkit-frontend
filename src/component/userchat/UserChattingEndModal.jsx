import React, { useState, useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";
import axios from "axios";

const UserChattingEndModal = ({ isOpen, onClose, roomId }) => {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [step, setStep] = useState("mission");
  const [options, setOptions] = useState([]);

  const emotions = [
    { text: "정말 즐거웠어요", emoji: "🥰" },
    { text: "편안했어요", emoji: "☺️" },
    { text: "평범했어요", emoji: "😐" },
    { text: "아쉬웠어요", emoji: "😔" },
    { text: "불편했어요", emoji: "😣" },
  ];

  useEffect(() => {
    if (isOpen && roomId) {
      axios.get(`/api/user-chat/room/${roomId}/mission/options`)
        .then(res => setOptions(res.data))
        .catch(err => console.error("미션 옵션 로드 실패:", err));
    }
  }, [isOpen, roomId]);

  if (!isOpen) return null;

  const handleMissionSubmit = async (keyword) => {
    try {
      await axios.post(`/api/user-chat/room/${roomId}/mission/guess`, {
        guessedKeyword: keyword,
      });
    } catch (error) {
      console.error("미션 제출 실패:", error);
    } finally {
      setStep("review");
    }
  };

  const toggleEmotion = (emotionText) => {
    setSelectedEmotion((prev) => (prev === emotionText ? null : emotionText));
  };

  const handleSubmit = async () => {
    if (!selectedEmotion) {
      alert("상대방에 대한 감정을 선택해주세요!");
      return;
    }

    try {
      await axios.post(`/api/user-chat/room/${roomId}/review`, {
        emotion: selectedEmotion,
      });
      alert("소중한 후기 감사합니다. 온도가 반영되었습니다!");
      onClose(); 
      window.location.href = "/mypage";
    } catch (error) {
      console.error("후기 저장 실패:", error);
      alert("후기 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl">
        
        {step === "mission" ? (
          <>
            <h2 className="text-xl font-bold text-center mb-2">상대방의 키워드는?</h2>
            <p className="text-center text-gray-500 mb-6 text-sm">추측되는 키워드를 하나 선택해주세요.</p>
            <div className="grid grid-cols-2 gap-3">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMissionSubmit(opt)}
                  className="py-3 px-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium"
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-3 text-gray-800">
              대화가 끝났어요!
            </h2>
            <p className="text-center text-gray-600 mb-2 text-sm sm:text-base">
              상대방과의 대화는 어떠셨나요?
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
              {emotions.map((emotion, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleEmotion(emotion.text)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    selectedEmotion === emotion.text
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {emotion.text} {emotion.emoji}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-100"
              >
                종료
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserChattingEndModal;