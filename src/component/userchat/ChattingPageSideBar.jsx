import React, { useEffect, useRef } from "react";
import { MessageSquare, ChevronRight } from "lucide-react";

const ChatRoomSidebar = ({ rooms = [], activeRoomId, onSelectRoom }) => {
  const listRef = useRef(null);

  // 새 메시지 수신으로 rooms 배열이 바뀌어도 스크롤 위치 유지
  const scrollTopRef = useRef(0);
  const handleScroll = () => {
    if (listRef.current) scrollTopRef.current = listRef.current.scrollTop;
  };
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = scrollTopRef.current;
  }, [rooms]);

  return (
    <aside className="w-64 shrink-0 h-full flex flex-col border-r border-gray-100 bg-[#f8fafc]">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-gray-100 bg-white flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-blue-500 shrink-0" />
        <span className="text-sm font-bold text-gray-700">내 채팅 목록</span>
        {rooms.some(r => r.hasUnread) && (
  <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
)}
      </div>
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2"
      >
        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12 text-gray-400">
            <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-xs">참여 중인 채팅방이 없습니다</p>
          </div>
        ) : (
          rooms.map((room) => {
            const isActive = room.roomId === activeRoomId;
            const hasUnread = !isActive && room.hasUnread === true;

            return (
              <button
                key={room.roomId}
                onClick={() => !isActive && onSelectRoom(room)}
                className={`w-full text-left rounded-xl px-3 py-2.5 transition-all duration-150 group relative
                  ${isActive
                    ? "bg-blue-50 border border-blue-200 shadow-sm"
                    : "bg-white border border-transparent hover:border-gray-200 hover:shadow-sm active:scale-[0.98]"
                  }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5
                      ${isActive
                        ? "bg-gradient-to-br from-blue-400 to-blue-600"
                        : "bg-gradient-to-br from-green-400 to-blue-500"
                      }`}
                  >
                    {room.topic?.charAt(0) || "#"}
                  </div>

                  {/* 텍스트 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className={`text-xs font-bold truncate leading-tight
                          ${isActive ? "text-blue-700" : "text-gray-800"}`}
                      >
                        {room.topic || "채팅방"}
                      </span>
                      <span className="text-[9px] text-gray-400 shrink-0 ml-1">
                        {room.lastTime || ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[11px] text-gray-500 truncate leading-snug flex-1">
                        {room.lastMessage || "대화를 시작해보세요!"}
                      </p>
                      {/* 읽지 않은 메시지 빨간 점 */}
                      {hasUnread && (
                         <span className="shrink-0 w-2.5 h-2.5 bg-red-500 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>

                {isActive && (
                  <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-blue-400" />
                )}
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default ChatRoomSidebar;