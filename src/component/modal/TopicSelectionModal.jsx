import React, { useState, useEffect } from "react";
import { Search, RefreshCw, MessageSquare } from "lucide-react";

const TopicSelectionModal = ({
  isOpen,
  onSelectTopic,
  onCreateNew,
  topics,
  onRefresh,
  onSelectRoom
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [myChatRooms, setMyChatRooms] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/user-chat/my-rooms")
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setMyChatRooms(Array.isArray(data) ? data : []))
        .catch(() => setMyChatRooms([]));
    }
  }, [isOpen]);

  // 빼먹었던 기본 주제들 다시 추가
  const defaultTopics = [
    { id: "daily", label: "일상 대화", emoji: "☕" },
    { id: "worry", label: "고민 상담", emoji: "🌙" },
    { id: "hobby", label: "취미 공유", emoji: "🎨" },
    { id: "love", label: "연애 상담", emoji: "💖" },
  ];

  if (!isOpen) return null;

  const filteredTopics = (topics || []).filter((topic) =>
    topic.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
      {/* h-[550px]로 높이를 완전히 고정해서 목록이 늘어나도 창이 커지지 않게 함 */}
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[550px] shadow-2xl overflow-hidden flex flex-col md:flex-row shadow-black/20">
        {/* 좌측: 내 채팅 목록 (높이 고정 및 스크롤) */}
        <div className="w-full md:w-72 bg-slate-50 border-r border-gray-100 flex flex-col h-full">
          <div className="p-5 border-b border-gray-100 bg-white">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              내가 참여 중인 대화
            </h3>
          </div>

          {/* flex-1과 overflow-y-auto로 이 안에서만 스크롤 발생 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {myChatRooms.map((room) => (
              <div
                key={room.roomId}
                onClick={() => {
                  if (onSelectRoom) onSelectRoom(room);
                }}
                className="bg-white p-3 rounded-xl border border-gray-100 hover:border-blue-200 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-xs text-gray-800">
                    {room.topic}
                  </span>
                  <span className="text-[9px] text-gray-400">{room.time}</span>
                </div>
                <p className="text-[11px] text-gray-500 truncate">
                  {room.lastMessage}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 우측: 주제 선택 영역 (높이 고정 및 스크롤) */}
        <div className="flex-1 flex flex-col bg-white h-full">
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                새로운 대화 시작하기
              </h2>
              <button
                onClick={onRefresh}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* 기본 주제 그리드 */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {defaultTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => onSelectTopic(topic.label)}
                  className="flex items-center gap-2.5 p-2.5 border border-gray-100 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all text-left"
                >
                  <span className="text-base">{topic.emoji}</span>
                  <span className="text-sm font-medium text-gray-600">
                    {topic.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="h-px bg-gray-100 w-full mb-4" />

            {/* 검색창 */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="관심 있는 대화 주제 검색"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* 실시간 대기 목록 (남은 공간 다 쓰고 스크롤) */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar mb-4">
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectTopic(topic)}
                    className="w-full flex items-center gap-3 p-3 border border-gray-50 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all text-left"
                  >
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 text-xs font-bold">
                      #
                    </div>
                    <div className="font-bold text-sm text-gray-700">
                      {topic}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-6 text-gray-400 text-xs italic">
                  대기 중인 방이 없습니다.
                </div>
              )}
            </div>

            <button
              onClick={onCreateNew}
              className="w-full py-3.5 bg-[#0f172a] text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg text-sm shrink-0"
            >
              직접 대화 주제 만들기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicSelectionModal;
