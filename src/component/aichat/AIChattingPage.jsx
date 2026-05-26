import React, { useState, useEffect } from "react";
import axios from "../../api/axiosInstance";
import { Send } from "lucide-react";
import AISituationSidebar from "./AISituationiSidebar";
import ChatHistorySidebar from "./ChatHistorySidebar";
import AIChattingHeader from "./AIChattingHeader";
import ChattingEndModal from "./AIChatEndModal";
import AIChatHelpModal from "../modal/ChattingHelpModal";

const AICoachChat = () => {
  const [showChat, setShowChat] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [situations, setSituations] = useState([]);
  const [myRooms, setMyRooms] = useState([]);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [sitRes, roomRes] = await Promise.all([
          axios.get("/api/ai-situation"),
          axios.get("/api/ai-chat/my-rooms")
        ]);
        setSituations(sitRes.data.data);
        setMyRooms(roomRes.data.data);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };
    fetchInitialData();
  }, []);

  // 상황 선택 핸들러
  const handleSelectSituation = async (situationId) => {
    try {
      const response = await axios.post("/api/ai-chat/room", { situationId });
      const newRoom = response.data.data;
      
      setCurrentRoomId(newRoom.chatRoomId);
      const roomResponse = await axios.get(`/api/ai-chat/my-rooms`);
      setMyRooms(roomResponse.data.data);
      
      setMessages([
        { type: "NOTICE", content: `새로운 연습을 시작합니다. 👍` },
        ...(newRoom.messages || [])
      ]);
      setShowChat(true);
    } catch (error) {
      console.error("채팅방 생성 에러:", error);
      alert("채팅방 생성에 실패했습니다.");
    }
  };

  // 과거 기록 로드 핸들러
  const handleLoadPastRoom = (room) => {
    setCurrentRoomId(room.chatRoomId);
    setMessages(room.messages && room.messages.length > 0 
      ? room.messages 
      : [{ type: "NOTICE", content: "이전 대화 내용이 없습니다." }]
    );
    setShowChat(true);
  };

  // 메시지 전송 핸들러
  const handleSendMessage = async () => {
    if (!inputText.trim() || !currentRoomId || isLoading) return;

    const userMsg = { type: "USER", content: inputText, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await axios.post(`/api/ai-chat/message/${currentRoomId}`, {
        message: inputText
      });
      setMessages((prev) => [...prev, { 
        type: "AI", 
        content: response.data.data, 
        createdAt: new Date().toISOString() 
      }]);
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("현재 채팅을 초기화하시겠습니까?")) {
      setMessages(prev => [prev[0]]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* 왼쪽 사이드바: 상황 선택 */}
      <AISituationSidebar 
        situations={situations} 
        onSelectSituation={handleSelectSituation} 
      />

      {/* 2. 중앙 영역: 헤더 + 대화창 + 입력창 */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <AIChattingHeader
          showChat={showChat} 
          setShowChat={setShowChat} 
          handleReset={handleReset} 
          setShowHelp={setShowHelp}
          setIsEndModalOpen={setIsEndModalOpen}
        />

        {/* 메시지 영역 */}
        {showChat ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === "USER" ? "justify-end" : "justify-start"}`}>
                {msg.type === "NOTICE" ? (
                  <div className="bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-full text-sm mx-auto text-yellow-700">
                    👍 {msg.content}
                  </div>
                ) : (
                  <div className={`flex gap-3 max-w-[80%] ${msg.type === "USER" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.type === "AI" ? "bg-gradient-to-br from-purple-400 to-blue-400" : "bg-green-400"}`}>
                      <span className="text-white font-bold text-xs">{msg.type === "AI" ? "AI" : "나"}</span>
                    </div>
                    <div className="flex flex-col">
                      <div className={`px-4 py-3 rounded-2xl shadow-sm whitespace-pre-wrap ${
                        msg.type === "USER" ? "bg-green-400 text-white rounded-tr-sm" : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 px-1">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-center gap-2 text-xs text-gray-400 animate-pulse">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                AI 코치가 생각 중입니다...
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50 whitespace-pre-wrap text-center">
            {"왼쪽 사이드 바에 있는 상황을 선택하여 \n AI와 대화 연습을 시작해보세요! 😊"}
          </div>
        )}

        {/* 입력 영역 */}
        <div className="p-4 bg-white border-t sticky bottom-0">
          <div className="max-w-4xl mx-auto flex gap-3">
            <textarea
              rows="1"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={!currentRoomId || isLoading}
              placeholder={currentRoomId ? "메시지를 입력해보세요..." : "상황을 선택해주세요."}
              className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none resize-none min-h-[50px] max-h-[150px]"
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentRoomId || isLoading || !inputText.trim()}
              className="px-6 bg-green-400 text-white rounded-xl hover:bg-green-500 disabled:bg-gray-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 오른쪽 사이드바: 히스토리 */}
      <ChatHistorySidebar 
        myRooms={myRooms} 
        currentRoomId={currentRoomId} 
        onLoadPastRoom={handleLoadPastRoom} 
      />
      
      {/* 모달 영역 */}
      <AIChatHelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <ChattingEndModal isOpen={isEndModalOpen} onClose={() => setIsEndModalOpen(false)} roomId={currentRoomId} />
    </div>
  );
};

export default AICoachChat;