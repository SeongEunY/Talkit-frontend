import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance"; // 경로 맞게 확인

const FEEDBACK_TAGS = [
  { tag: "REPEAT",   label: "앵무새형",   desc: "같은 말을 반복해요",  emoji: "🔁" },
  { tag: "QUESTION", label: "탐정형",     desc: "질문이 정말 많아요",   emoji: "🕵️" },
  { tag: "ZZZ",      label: "수면유도형", desc: "대화가 좀 지루했어요", emoji: "😪" },
  { tag: "GAG",      label: "개그형",     desc: "너무 웃겼어요",        emoji: "😄" },
];

const ChattingFeedbackModal = ({ isOpen, onClose, roomId, writerId }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const toggleTag = (tag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length >= 2) return prev;
      return [...prev, tag];
    });
  };

  const handleSubmit = async () => {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append("roomId", roomId);
      searchParams.append("writerId", writerId);
      selectedTags.forEach(tag => searchParams.append("tags", tag));
      if (comment) searchParams.append("comment", comment);

      await axiosInstance.post(`/api/chat-feedback?${searchParams.toString()}`);
      setSelectedTags([]);
      setComment("");
      onClose();
    } catch (err) {
      console.error("피드백 제출 실패", err);
    }
  };

  const handleClose = () => {
    setSelectedTags([]);
    setComment("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 text-gray-800">
          대화 어떠셨나요? 💬
        </h2>
        <p className="text-center text-gray-500 mb-1 text-sm">
          상대방의 대화 스타일을 선택해주세요
        </p>
        <p className="text-center text-gray-400 mb-5 text-xs">
          최대 2개까지 선택 가능해요
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {FEEDBACK_TAGS.map(({ tag, label, desc, emoji }) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`p-3 rounded-xl border-2 text-left transition-all duration-150 ${
                  isSelected
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className="block text-base mb-1">{emoji} {label}</span>
                <span className="block text-xs text-gray-500">{desc}</span>
              </button>
            );
          })}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="추가로 하고 싶은 말이 있다면 남겨주세요 (선택)"
          className="w-full h-20 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 resize-none focus:outline-none focus:border-blue-300 mb-5"
        />

        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            건너뛰기
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            제출하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChattingFeedbackModal;