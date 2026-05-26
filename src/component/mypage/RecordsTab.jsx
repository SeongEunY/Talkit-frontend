import React, { useState, useEffect } from "react";
import { Clock, Smile, Frown, Meh } from "lucide-react";

const RecordsTab = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const EMOTION_CONFIG = {
    GREAT: {
      border: "border-red-400",
      icon:<Smile className="w-4 h-4 text-red-400" />,
      iconColor: "text-red-400",
      label: "최고였어요",
    },
    GOOD: {
      border: "border-orange-400",
      icon: <Smile className="w-4 h-4 text-orange-400" />,
      iconColor: "text-orange-400",
      label: "좋았어요",
    },
    NORMAL: {
      border: "border-green-400",
      icon: <Meh   className="w-4 h-4 text-green-400" />,
      iconColor: "text-green-400",
      label: "보통이에요",
    },
    BAD: {
      border: "border-sky-400",
      icon: <Frown className="w-4 h-4 text-sky-400" />,
      iconColor: "text-sky-400",
      label: "별로였어요",
    },
    TERRIBLE: {
      border: "border-blue-600",
      icon: <Frown className="w-4 h-4 text-blue-600" />,
      iconColor: "text-blue-600",
      label: "최악이었어요",
    },
    default: {
      border: "border-gray-300",
      icon: <Meh   className="w-4 h-4 text-gray-300" />,
      iconColor: "text-gray-300",
      label: "평가 없음",
    },
  };

  const getEmotionConfig = (emotion) =>
    EMOTION_CONFIG[emotion] ?? EMOTION_CONFIG.default;

  const specialTagLabel = (tag) => {
    switch (tag) {
      case "GAG":
        return "😄 유머러스해요";
      case "QUESTION":
        return "🙋 질문을 잘해요";
      case "ZZZ":
        return "😴 지루해요";
      case "REPEAT":
        return "🔁 반복적이에요";
      default:
        return null;
    }
  };

  //모달 열릴 시 body 스크롤 방지
  useEffect(() => {
    if (selectedRoom) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedRoom]);

  useEffect(() => {
    fetch("/api/user-chat/my-history")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setHistory(data);
        else setHistory([]);
      })
      .catch(() => setHistory([]));
  }, []);

  const handleSelectRoom = async (conv) => {
    setLoadingDetail(true);
    try {
      const [detailRes, messagesRes] = await Promise.all([
        fetch(`/api/user-chat/room/${conv.roomId}/detail`),
        fetch(`/api/user-chat/room/${conv.roomId}/messages`),
      ]);
      const detail = await detailRes.json();
      const messages = await messagesRes.json();

      setSelectedRoom({ conv, detail, messages });
    } catch (e) {
      console.error("상세 정보 로드 실패:", e);
    } finally {
      setLoadingDetail(false);
    }
  };

  // 날짜 포맷
  const formatDate = (dateStr) => (dateStr ? dateStr.substring(0, 10) : "");

  const formatDuration = (minutes) => {
    if (!minutes) return "1분 미만";
    if (minutes < 60) return `${minutes}분`;
    return `${Math.floor(minutes / 60)}시간 ${minutes % 60}분`;
  };

  return (
    <div className="space-y-4">
      {history.map((conv) => {
        const cfg = getEmotionConfig(conv.emotion);
        return (
          <button
            key={conv.roomId}
            className={`w-full text-left bg-white p-4 rounded-lg shadow border-l-4 ${cfg.border} cursor-pointer hover:bg-gray-50 transition`}
            onClick={() => handleSelectRoom(conv)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className={`text-lg ${cfg.iconColor}`}>{cfg.icon}</span>
                <span className="font-medium">{conv.topic}</span>
              </div>
              <span className="text-gray-400 text-sm">
                {formatDate(conv.endedAt)}
              </span>
            </div>
            <div className="text-gray-400 text-xs mt-1">
              {conv.messageCount}개 메시지
            </div>
          </button>
        );
      })}

      {/* 로딩 */}
      {loadingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl p-6 text-gray-500">
            불러오는 중...
          </div>
        </div>
      )}

      {/* 상세 모달 */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-lg relative flex flex-col max-h-[85vh]">
            {/* 모달 헤더 */}
            <div className="flex justify-between items-start p-6 pb-3 flex-shrink-0">
              <div>
                <h2 className="font-bold text-lg">{selectedRoom.conv.topic}</h2>
                <span className="text-xs text-gray-400 mt-1 block">
                  {formatDate(selectedRoom.conv.endedAt)}
                </span>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold ml-4 mt-1"
              >
                ✕
              </button>
            </div>

            {/* 채팅 내용 - 스크롤 영역 */}
            <div className="overflow-y-auto flex-1 px-6 py-2 space-y-2">
              {selectedRoom.messages.map((msg) => {
                // 시스템 메시지
                if (
                  msg.type === "SYSTEM" ||
                  msg.type === "system" ||
                  !msg.senderId
                ) {
                  return (
                    <div key={msg.cmid} className="flex justify-center my-1">
                      <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                        {msg.message}
                      </span>
                    </div>
                  );
                }

                const isMine =
                  String(msg.senderId) === String(selectedRoom.detail.myUserId);
                const timeStr = msg.timestamp
                  ? new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "";

                return (
                  <div
                    key={msg.cmid}
                    className={`flex items-end gap-1 ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    {/* 상대방 아바타 */}
                    {!isMine && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-[10px] flex-shrink-0">
                        {msg.senderNickname?.substring(0, 1)}
                      </div>
                    )}

                    <div
                      className={`flex flex-col gap-0.5 max-w-xs ${isMine ? "items-end" : "items-start"}`}
                    >
                      {/* 닉네임 (상대방만) */}
                      {!isMine && (
                        <span className="text-[10px] text-gray-400 ml-1">
                          {msg.senderNickname}
                        </span>
                      )}

                      <div
                        className={`flex items-end gap-1 ${isMine ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div
                          className={`px-3 py-2 rounded-2xl text-sm ${
                            isMine
                              ? "bg-green-400 text-white rounded-tr-sm"
                              : "bg-gray-100 text-gray-800 rounded-tl-sm"
                          }`}
                        >
                          {msg.message}
                        </div>
                        <span className="text-[10px] text-gray-400 flex-shrink-0 mb-0.5">
                          {timeStr}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gray-50 rounded-b-xl px-6 py-4 space-y-2 text-sm flex-shrink-0 border-t">
              <div className="flex justify-between">
                <span className="text-gray-500">내 키워드 미션</span>
                <span className="font-semibold text-blue-500">
                  {selectedRoom.detail.myMissionKeyword ?? "없음"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">상대가 추측한 내 키워드</span>
                <span className="font-semibold">
                  {selectedRoom.detail.opponentGuessedKeyword ?? "미제출"}
                </span>
              </div>
              {(() => {
                const cfg = getEmotionConfig(
                  selectedRoom.detail.opponentEmotion,
                );
                return (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">받은 평가</span>
                    <span
                      className={`flex items-center gap-1 font-semibold ${cfg.iconColor}`}
                    >
                      <span>{cfg.icon}</span>
                      {cfg.label}
                    </span>
                  </div>
                );
              })()}

              {(selectedRoom.detail.specialTag1 ||
                selectedRoom.detail.specialTag2) && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-500">상대방 태그</span>
                  <div className="flex flex-col items-end gap-1">
                    {selectedRoom.detail.specialTag1 && (
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                        {specialTagLabel(selectedRoom.detail.specialTag1)}
                      </span>
                    )}
                    {selectedRoom.detail.specialTag2 && (
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                        {specialTagLabel(selectedRoom.detail.specialTag2)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {selectedRoom.detail.comment && (
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500">상대방 코멘트</span>
                  <p className="text-gray-700 bg-white border rounded-lg px-3 py-2 text-xs leading-relaxed">
                    {selectedRoom.detail.comment}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 총 대화 시간
                </span>
                <span className="font-semibold">
                  {formatDuration(selectedRoom.detail.durationMinutes)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordsTab;
