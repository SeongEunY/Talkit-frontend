import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send } from "lucide-react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import TopicSelectionModal from "./modal/TopicSelectionModal";
import ChattingEndModal from "./userchat/UserChattingEndModal.jsx";
import UserChattingHeader from "./userchat/UserChattingHeader.jsx";
import CreateChatRoom from "./modal/CreateChatRoom";
import ChattingExtendModal from "./modal/ChattingExtendModal.jsx";
import ChattingExtendWaitingModal from "./modal/ChattingExtendWaitingModal.jsx";
import FeedbackModal from "./modal/FeedbackModal.jsx";
import ChatRoomSidebar from "./userchat/ChattingPageSideBar.jsx";

const Chattingpage = () => {
  const [showChatEnd, setShowChatEnd] = useState(false);
  const [messages, setMessages] = useState([]);
  const [maxTurns, setMaxTurns] = useState(40);
  const [myContinuousCount, setMyContinuousCount] = useState(0);
  const [inputText, setInputText] = useState("");
  const [showTopicModal, setShowTopicModal] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showExtendWaitingModal, setShowExtendWaitingModal] = useState(false);
  const [dbTopics, setDbTopics] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [topic, setTopic] = useState("");
  const [missionKeyword, setMissionKeyword] = useState("");

  const [mySidebarRooms, setMySidebarRooms] = useState([]);

  const isMounted = useRef(false);
  const userIdRef = useRef(null);

  const [roomId, setRoomId] = useState(null);
  const [isMatched, setIsMatched] = useState(false);
  const [userId, setUserId] = useState(null);
  const stompClient = useRef(null);
  const roomIdRef = useRef(null);
  const messagesEndRef = useRef(null);

  const fetchSidebarRooms = useCallback(async () => {
    try {
      const res = await fetch("/api/user-chat/my-rooms");
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data)) return;

      const sorted = [...data].sort((a, b) => b.roomId - a.roomId);
      setMySidebarRooms(sorted);
    } catch (e) {
      console.error("사이드바 방 목록 로드 실패:", e);
    }
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch("/api/user-chat/topics");
      if (response.ok) {
        const data = await response.json();
        setDbTopics(data);
      }
    } catch (error) {
      console.error("토픽 로딩 실패:", error);
    }
  };

  useEffect(() => {
    if (showTopicModal) fetchTopics();
  }, [showTopicModal]);

  useEffect(() => {
    fetchSidebarRooms();
  }, [fetchSidebarRooms]);

  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  const handleSidebarRoomSelect = useCallback(
    async (room) => {
      roomIdRef.current = room.roomId;
      disconnect();
      if (room.roomId && userId) {
        try {
          await fetch(`/api/user-chat/room/${room.roomId}/read`, {
            method: "POST",
          });
        } catch (e) {
          console.error("읽음 처리 실패:", e);
        }
      }

      setTopic(room.topic);
      setRoomId(room.roomId);
      setMessages([]);
      setMyContinuousCount(0);
      setIsMatched(true);
      setShowTopicModal(false);

      connect(room.roomId);
      await loadHistory(room.roomId, room.userId || userId);
      fetchRoomInfo(room.roomId);

      if (room.pendingEvent === "CHAT_END") {
        const currentMax = room.pendingMax || 3;
        setTimeout(
          () => addSystemMessage("💬 대화가 종료되었습니다.", "gray"),
          200,
        );
        setTimeout(() => {
          if (room.pendingForced || currentMax > 3) {
            setShowFeedbackModal(true);
          } else {
            setShowExtendModal(true);
          }
        }, 2800);
      } else if (room.pendingEvent === "EXTEND_COMPLETE") {
        if (room.newMaxTurns) setMaxTurns(room.newMaxTurns);
        addSystemMessage(
          "🎉 대화가 연장되었습니다! 계속 대화를 나눠보세요.",
          "green",
        );
      } else if (room.pendingEvent === "EXTEND_REJECTED") {
        setShowFeedbackModal(true);
      } else if (room.pendingEvent === "EXTEND_WAITING") {
        setShowExtendModal(true);
      }

      setMySidebarRooms((prev) =>
        prev.map((r) =>
          r.roomId === room.roomId
            ? { ...r, hasUnread: false, pendingEvent: null }
            : r,
        ),
      );
    },

  // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId],
  );

  const handleRoomSelect = (room) => {
    roomIdRef.current = room.roomId;
    setTopic(room.topic);
    const currentUserId = room.userId || userId;
    if (!currentUserId) {
      alert("사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
      return;
    }
    setUserId(currentUserId);
    setRoomId(room.roomId);
    setMaxTurns(room.maxTurns);
    setIsMatched(true);
    setShowTopicModal(false);

    disconnect();
    connect(room.roomId);
    loadHistory(room.roomId, currentUserId);
    fetchRoomInfo(room.roomId);
  };

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;
    return () => {
      if (stompClient.current) stompClient.current.deactivate();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const initMatch = async (selectedTopic) => {
    setTopic(selectedTopic);
    try {
      const response = await fetch("/api/user-chat/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: selectedTopic }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "서버 매칭 중 오류가 발생했습니다.",
        );
      }

      const data = await response.json();

      if (data?.roomId) {
        roomIdRef.current = data.roomId;
        setRoomId(data.roomId);
        setMaxTurns(data.maxTurns);
        setIsMatched(data.matched);
        setUserId(data.userId);

        connect(data.roomId);
        loadHistory(data.roomId);

        if (data.missionKeyword) setMissionKeyword(data.missionKeyword);
        fetchSidebarRooms();
      }
    } catch (error) {
      console.error("매칭 실패:", error);
    }
  };

  const loadHistory = async (id, currentUserId) => {
    if (!id) return;
    try {
      const response = await fetch(`/api/user-chat/room/${id}/messages`);
      const history = await response.json();
      const historyArray = Array.isArray(history) ? history : [];
      setMessages(historyArray);

      fetch(`/api/user-chat/room/${id}/read`, { method: "POST" }).catch(
        () => {},
      );

      setMySidebarRooms((prev) =>
        prev.map((r) => (r.roomId === id ? { ...r, hasUnread: 0 } : r)),
      );

      const activeId = currentUserId || userId;
      let count = 0;
      for (let i = historyArray.length - 1; i >= 0; i--) {
        if (historyArray[i].senderId === Number(activeId)) {
          count++;
        } else {
          break;
        }
      }
      setMyContinuousCount(count);
    } catch (error) {
      console.error("History 로드 에러:", error);
      setMessages([]);
    }
  };

  const handleTopicSelect = (topic) => {
    setShowTopicModal(false);
    initMatch(topic);
  };

  const handleCreateNewRoom = () => {
    setShowTopicModal(false);
    setShowCreateModal(true);
  };

  const handleConfirmCreate = (newTopic) => {
    setShowCreateModal(false);
    initMatch(newTopic);
  };

  const addSystemMessage = (text, color = "blue") => {
    setMessages((prev) => [
      ...prev,
      { cmid: `system-${Date.now()}`, type: "system", text, color },
    ]);
  };

  const connect = (id) => {
    const socket = new SockJS("http://15.164.212.158/ws");
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.current.subscribe(`/sub/room/${id}`, (frame) => {
          if (frame.body === "MATCH_COMPLETE") {
            setIsMatched(true);
            fetchRoomInfo(id);
            fetchSidebarRooms();
            return;
          }

          try {
            const data = JSON.parse(frame.body);
            if (
              data.status === "MATCH_COMPLETE" ||
              data.type === "MATCH_COMPLETE"
            ) {
              setIsMatched(true);
              fetchSidebarRooms();
              return;
            }
            if (data.type === "EXTEND_WAITING") {
              setMySidebarRooms((prev) =>
                prev.map((r) =>
                  r.roomId === data.roomId
                    ? { ...r, pendingEvent: "EXTEND_WAITING" }
                    : r,
                ),
              );
              return;
            }
            if (data.type === "EXTEND_COMPLETE") {
              setShowExtendWaitingModal(false);
              if (data.newMaxTurns) setMaxTurns(data.newMaxTurns);
              addSystemMessage(
                "🎉 대화가 연장되었습니다! 계속 대화를 나눠보세요.",
                "green",
              );
              return;
            }
            if (data.type === "CHAT_END") {
              const currentMax = data.maxTurns || maxTurns;
              setTimeout(
                () => addSystemMessage("💬 대화가 종료되었습니다.", "gray"),
                200,
              );
              setTimeout(() => {
                if (data.forced || currentMax > 3) {
                  setShowExtendModal(false);
                  setShowFeedbackModal(true);
                } else {
                  setShowExtendModal(true);
                }
              }, 2800);
              fetchSidebarRooms();
              return;
            }

            // 일반 메시지 처리
            setMessages((prev) => [...prev, data]);
            if (Number(data.senderId) !== Number(userIdRef.current)) {
              setMyContinuousCount(0);
            }

            // 사이드바 갱신
            setMySidebarRooms((prev) => {
              const updated = prev.map((r) => {
                if (r.roomId === id) {
                  return {
                    ...r,
                    lastMessage:
                      data.message?.length > 20
                        ? data.message.substring(0, 20) + "..."
                        : data.message,
                    lastTime: new Date(data.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    hasUnread: false,
                  };
                }
                return r;
              });
              const idx = updated.findIndex((r) => r.roomId === id);
              if (idx > 0) {
                const [target] = updated.splice(idx, 1);
                return [target, ...updated];
              }
              return updated;
            });
          } catch (e) {
            console.error("메시지 파싱 에러:", e);
          }
        });

        // 개인 사이드바 업데이트 구독
        const currentUserId = userIdRef.current;
        if (currentUserId) {
          stompClient.current.subscribe(
            `/sub/user/${currentUserId}/sidebar`,
            (frame) => {
              try {
                const data = JSON.parse(frame.body);
                if (data.type !== "SIDEBAR_UPDATE") return;
                setMySidebarRooms((prev) => {
                  const updated = prev.map((r) => {
                    if (r.roomId === data.roomId) {
                      return {
                        ...r,
                        lastMessage: data.lastMessage,
                        lastTime: new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                        hasUnread: data.roomId !== roomIdRef.current,
                      };
                    }
                    return r;
                  });
                  const idx = updated.findIndex(
                    (r) => r.roomId === data.roomId,
                  );
                  if (idx > 0) {
                    const [target] = updated.splice(idx, 1);
                    return [target, ...updated];
                  }
                  return updated;
                });
              } catch (e) {
                console.error("사이드바 업데이트 에러:", e);
              }
            },
          );

          // ✅ event 채널 구독 - SIDEBAR_UPDATE 제거, EXTEND_REJECTED/CHAT_END/EXTEND_COMPLETE만 처리
          stompClient.current.subscribe(
            `/sub/user/${currentUserId}/event`,
            (frame) => {
              try {
                const data = JSON.parse(frame.body);
                const isCurrentRoom =
                  String(data.roomId) === String(roomIdRef.current);

                if (data.type === "EXTEND_REJECTED") {
                  if (isCurrentRoom) {
                    setShowExtendWaitingModal(false);
                    setShowExtendModal(false);
                    setShowFeedbackModal(true);
                  } else {
                    setMySidebarRooms((prev) =>
                      prev.map((r) =>
                        r.roomId === data.roomId
                          ? { ...r, pendingEvent: "EXTEND_REJECTED" }
                          : r,
                      ),
                    );
                  }
                  return;
                }

                if (isCurrentRoom) return;

                if (data.type === "CHAT_END") {
                  const currentMax = data.maxTurns || maxTurns;
                  setMySidebarRooms((prev) =>
                    prev.map((r) =>
                      r.roomId === data.roomId
                        ? {
                            ...r,
                            pendingEvent: "CHAT_END",
                            pendingMax: currentMax,
                            pendingForced: data.forced,
                          }
                        : r,
                    ),
                  );
                }

                if (data.type === "EXTEND_COMPLETE") {
                  setMySidebarRooms((prev) =>
                    prev.map((r) =>
                      r.roomId === data.roomId
                        ? {
                            ...r,
                            pendingEvent: "EXTEND_COMPLETE",
                            newMaxTurns: data.newMaxTurns,
                          }
                        : r,
                    ),
                  );
                }
              } catch (e) {
                console.error("이벤트 처리 에러:", e);
              }
            },
          );
        }
      },
      onStompError: (frame) => console.error(frame.headers["message"]),
    });
    stompClient.current.activate();
  };

  const fetchRoomInfo = async (id) => {
    try {
      const response = await fetch(`/api/user-chat/room/${id}/info`);
      const data = await response.json();
      if (String(id) !== String(roomIdRef.current)) return;

      if (data.missionKeyword) setMissionKeyword(data.missionKeyword);
      if (data.maxTurns) setMaxTurns(data.maxTurns);
      if (data.isOvered) {
        setIsMatched(false);
        setShowFeedbackModal(true);
      } else {
        setIsMatched(true);
      }
    } catch (error) {
      console.error("방 정보 로드 실패:", error);
    }
  };

  const disconnect = () => {
    if (stompClient.current) stompClient.current.deactivate();
  };

  const handleSendMessage = () => {
    const trimmedText = inputText.trim();
    if (!trimmedText || !isMatched || !stompClient.current || !userId) return;
    if (myContinuousCount >= 3) {
      alert("상대방의 대답을 기다려야 합니다.");
      return;
    }
    stompClient.current.publish({
      destination: `/pub/room/${roomId}/message`,
      body: JSON.stringify({ message: inputText }),
      headers: { userId: String(userId) },
    });
    setMyContinuousCount((prev) => prev + 1);
    setInputText("");
  };

  const handleExtendChat = () => {
    setShowExtendModal(false);
    setShowExtendWaitingModal(true);
    if (stompClient.current && roomId && userId) {
      stompClient.current.publish({
        destination: `/pub/room/${roomId}/extend`,
        headers: { userId: String(userId) },
        body: JSON.stringify({ action: "EXTEND" }),
      });
    }
  };

  const handleFeedbackSubmit = () => {
    setShowFeedbackModal(false);
    setShowChatEnd(true);
  };

  const isBlurred = showChatEnd || showExtendModal || showFeedbackModal;
  const isInputDisabled = !isMatched || myContinuousCount >= 3;
  let placeholderText = "매칭 대기 중...";
  if (isMatched) {
    placeholderText =
      myContinuousCount >= 3
        ? "상대방의 대답을 기다려주세요."
        : "메시지를 입력해주세요...";
  }

  const renderMessage = (msg) => {
    if (msg.type === "system" || !msg.senderId) {
      return (
        <div className="text-center my-2">
          <div
            className={`inline-block px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm ${(msg.text || msg.message)?.includes("연장") ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}
          >
            {msg.text || msg.message}
          </div>
        </div>
      );
    }

    if (msg.senderId === Number(userId)) {
      return (
        <div className="flex justify-end mb-4">
          <div className="flex flex-col items-end">
            <div className="bg-green-400 rounded-2xl rounded-tr-sm px-3 sm:px-4 py-2 sm:py-3 max-w-md">
              <p className="text-sm sm:text-base text-white">{msg.message}</p>
            </div>
            <p className="text-xs text-gray-400 mt-1 mr-2">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex gap-2 sm:gap-3 mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-[10px]">
          {msg.senderNickname?.substring(0, 1)}
        </div>
        <div>
          <div className="text-[10px] text-gray-500 mb-1 ml-1">
            {msg.senderNickname}
          </div>
          <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 sm:px-4 py-2 sm:py-3 max-w-md">
            <p className="text-sm sm:text-base text-gray-800">{msg.message}</p>
          </div>
          <p className="text-xs text-gray-400 mt-1 ml-2">
            {new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      className="w-full bg-gray-50 flex items-center justify-center relative overflow-hidden"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <div
        className={`w-full h-full max-w-5xl mx-auto bg-white flex transition-all duration-300 ${isBlurred ? "blur-sm" : ""}`}
      >
        <ChatRoomSidebar
          rooms={mySidebarRooms}
          activeRoomId={roomId}
          onSelectRoom={handleSidebarRoomSelect}
        />
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <div className="flex-shrink-0 border-b">
            <UserChattingHeader
              topic={topic}
              onForceEnd={async () => {
                try {
                  await fetch(`/api/user-chat/room/${roomId}/force-end`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                  });
                } finally {
                  disconnect();
                  setShowFeedbackModal(true);
                  fetchSidebarRooms();
                }
              }}
            />
          </div>
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-white">
            <div className="text-center">
              <div className="inline-block bg-blue-50 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm text-blue-600 mb-4">
                대화가 시작되었습니다. 서로를 존중하며 즐거운 대화 나눠보세요!
                👍
              </div>
            </div>
            {messages.map((msg) => (
              <div key={msg.cmid}>{renderMessage(msg)}</div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t p-3 sm:p-4 bg-white flex-shrink-0">
            {missionKeyword && (
              <p className="text-[11px] sm:text-xs text-gray-400 mb-2">
                🎯 키워드 미션:{" "}
                <span className="font-bold text-blue-500">
                  {missionKeyword}
                </span>
              </p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={placeholderText}
                disabled={isInputDisabled}
                className={`flex-1 px-3 py-2 border rounded-lg ${!isInputDisabled ? "bg-white" : "bg-gray-100"}`}
              />
              <button
                onClick={handleSendMessage}
                disabled={isInputDisabled}
                className="px-4 bg-green-400 text-white rounded-lg disabled:opacity-50"
              >
                <Send />
              </button>
            </div>
          </div>
        </div>
      </div>
      {showTopicModal && (
        <TopicSelectionModal
          isOpen={showTopicModal}
          onSelectTopic={handleTopicSelect}
          onSelectRoom={handleRoomSelect}
          onCreateNew={handleCreateNewRoom}
          topics={dbTopics}
          onRefresh={fetchTopics}
        />
      )}
      <CreateChatRoom
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleConfirmCreate}
      />
      <ChattingExtendModal
        isOpen={showExtendModal}
        onClose={() => {
          stompClient.current.publish({
            destination: `/pub/room/${roomId}/reject`,
            headers: { userId: String(userId) },
          });
          setShowExtendModal(false);
          setShowFeedbackModal(true);
        }}
        onExtend={handleExtendChat}
      />
      <ChattingExtendWaitingModal
        isOpen={showExtendWaitingModal}
        onCancel={() => {
          setShowExtendWaitingModal(false);
          setShowFeedbackModal(true);
        }}
      />
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          setShowChatEnd(true);
        }}
        roomId={roomId}
        writerId={userId}
        onSubmit={handleFeedbackSubmit}
      />
      <ChattingEndModal
        isOpen={showChatEnd}
        onClose={() => setShowChatEnd(false)}
        roomId={roomId}
      />
    </div>
  );
};

export default Chattingpage;
