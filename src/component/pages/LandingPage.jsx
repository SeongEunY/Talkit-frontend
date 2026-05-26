import React from "react";
import { useNavigate } from "react-router-dom";

const COLORS = {
  primary: "#A5F278",
  secondary: "#7AADFE",
};

export default function App() {
  const navigate = useNavigate();

  const features = [
    { icon: "💬", title: "10턴 익명 채팅", desc: "부담 없는 짧은 대화로 말문을 틔워보세요." },
    { icon: "🎯", title: "미션 & 키워드", desc: "매일 새로운 미션과 키워드로 연습해요." },
    { icon: "💝", title: "감정 태그 교환", desc: "대화 후 감정을 나누며 공감해요." },
    { icon: "🤖", title: "AI 피드백", desc: "AI가 맞춤 피드백으로 실력을 키워줘요." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF6FF] to-white text-gray-900">

      {/* HEADER */}
      <header className="w-full bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          
          <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <div className="flex gap-1">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: COLORS.primary }}></div>
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: COLORS.secondary }}></div>
            </div>
            말잇기
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate("/login")} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
              로그인
            </button>

            <button onClick={() => navigate("/signup")} className="px-4 py-2 rounded-lg bg-primary text-black shadow hover:bg-green-400 transition">
              회원가입
            </button>
          </div>
        </div>
      </header>
      
      {/* HERO SECTION */}
      <section className="text-center pt-32 pb-24">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-snug mb-6">
          짧은 대화로 성장하는 <br /> 당신의 말하기 습관
        </h1>

        <p className="text-gray-600 mb-10">
          10턴의 짧은 익명 대화, 매일 가벼운 말문 트기
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/login")}
            className="px-10 py-4 rounded-2xl text-black font-bold shadow-lg hover:scale-105 transition-transform flex flex-col items-center"
            style={{ backgroundColor: COLORS.secondary }}
          >
            <span className="text-xl">말잇기 시작</span>
            <span className="text-lg opacity-70 font-normal">Talk It Now!</span>
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white">
        <h2 className="text-center text-3xl font-bold mb-12">말잇기와 함께 성장해요</h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition border"
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-200 py-20 mt-20">
        <div className="max-w-6xl mx-auto px-10">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
            
            {/* 로고 */}
            <div className="flex flex-col items-start">
              <div className="text-2xl font-bold text-white mb-4">말잇기</div>
              <p className="text-gray-500 text-sm leading-relaxed">
                짧은 대화로 성장하는<br />당신의 말하기 습관
              </p>
            </div>

            {/* 서비스 */}
            <div className="flex flex-col md:items-center">
              <div className="text-left md:text-left min-w-[100px]">
                <h4 className="text-green-200 font-bold mb-6 text-lg tracking-wide">서비스</h4>
                <ul className="space-y-4 text-gray-400">
                  <li className="hover:text-white cursor-pointer transition">기능 소개</li>
                  <li className="hover:text-white cursor-pointer transition">요금제</li>
                  <li className="hover:text-white cursor-pointer transition">FAQ</li>
                </ul>
              </div>
            </div>

            {/* 팀원 정보 */}
            <div className="flex flex-col md:items-end">
              <div className="text-left md:text-left min-w-[100px]">
                <h4 className="text-green-200 font-bold mb-6 text-lg tracking-wide">팀 정보</h4>
                <ul className="space-y-4 text-gray-400">
                  <li className="hover:text-white cursor-pointer transition">소개</li>
                  <li className="hover:text-white cursor-pointer transition">문의</li>
                  <li className="hover:text-white cursor-pointer transition">블로그</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 하단 구분선 */}
          <div className="w-full border-t border-gray-800 mb-10 opacity-50"></div>

          {/* 카피라이트 */}
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm gap-4">
            <div>© 2025 <span className="text-gray-400">말잇기</span>. All rights reserved.</div>
            <div className="text-gray-600">
              Designed by <span className="font-medium text-gray-500">Team 말잇기</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
