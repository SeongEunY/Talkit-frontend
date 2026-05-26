import React from "react";
import { History, MessageSquare } from "lucide-react";

const ChatHistorySidebar = ({ myRooms, currentRoomId, onLoadPastRoom }) => {
  return (
    <div className="w-72 bg-white border-l flex flex-col shrink-0">
      <div className="p-6 border-b">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <History className="w-5 h-5 text-purple-500" />
          최근 연습 기록
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {myRooms.length > 0 ? (
            myRooms.map((room) => (
              <div
                key={room.chatRoomId}
                onClick={() => onLoadPastRoom(room)}
                className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
                  currentRoomId === room.chatRoomId
                    ? "border-purple-400 bg-purple-50"
                    : "border-gray-100 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className={`w-3.5 h-3.5 mt-0.5 ${
                    currentRoomId === room.chatRoomId ? "text-purple-500" : "text-gray-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-xs mb-1 truncate ${
                      currentRoomId === room.chatRoomId ? "text-purple-700" : "text-gray-700"
                    }`}>
                      {room.situationTitle}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {room.messages && room.messages.length > 0 
                        ? room.messages[room.messages.length - 1].content 
                        : "대화 내용 없음"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-xs text-gray-400">아직 연습 기록이 없어요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistorySidebar;