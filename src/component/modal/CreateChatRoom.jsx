import React, { useState } from "react";
import { X } from "lucide-react";

const CreateChatRoom = ({ isOpen, onClose, onCreate }) => {
  const [topic, setTopic] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!topic.trim()) {
      alert("주제를 입력해주세요!");
      return;
    }
    onCreate(topic); // 부모 컴포넌트에 입력한 주제 전달
    setTopic("");    // 입력창 초기화
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl relative">
        {/* 닫기 버튼 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-800">
          새로운 채팅방 만들기
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="어떤 주제로 대화를 시작할까요?"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          />

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-100"
          >
            생성하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChatRoom;