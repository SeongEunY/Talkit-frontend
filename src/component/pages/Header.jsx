import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../slices/loginSlice";
import axiosInstance from "../../api/axiosInstance";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  
  // userInfo 대신 리덕스 스토어에서 nickname을 직접 가져옴
  const { isLoggedIn, nickname } = useSelector((state) => state.login);
  const [isCompact, setIsCompact] = useState(false);
  const currentPath = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsCompact(y > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userName = nickname || "사용자";
  const firstLetter = userName.charAt(0);
  
  const isActive = (p) => currentPath === p;

  const handleLogoClick = () => {
    if (currentPath === "/") return;
    if (isLoggedIn) {
      navigate("/home");
    } else {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      try {
        await axiosInstance.post('/api/users/logout');
      } catch (error) {
        console.error(error);
      } finally {
        alert("로그아웃 되었습니다.");
        navigate("/", { replace: true });
        
        setTimeout(() => {
          dispatch(logout());
        }, 10);
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-[9999] bg-white transition-all duration-300 ease-in-out ${
        isCompact ? "h-16 shadow-md border-b border-gray-100" : "h-20 border-b border-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* LOGO */}
        <button 
          onClick={handleLogoClick} 
          disabled={currentPath === "/"}
          className={`flex items-center gap-2 group transition-all ${
            currentPath === "/" 
              ? "cursor-default opacity-100" 
              : "cursor-pointer active:scale-95 hover:opacity-80" 
          }`}
        >
          <div className="flex gap-1">
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: "#A5F278" }}></div>
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: "#7AADFE" }}></div>
          </div>
          <span className="text-xl font-bold text-gray-800">말잇기</span>
        </button>

        {/* NAVIGATION */}
        <nav className="hidden md:flex gap-8 items-center">
          {[
            { path: "/chatting", label: "말잇기" },
            { path: "/aichat", label: "AI연습" },
            { path: "/community", label: "커뮤니티" },
          ].map((nav) => (
            <button
              key={nav.path}
              onClick={() => navigate(nav.path)}
              className={`text-base transition-colors ${
                isActive(nav.path) ? "text-[#7AADFE] font-bold" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {nav.label}
            </button>
          ))}
        </nav>

        {/* USER ACTIONS */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/mypage")}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 font-bold shadow-sm" style={{ backgroundColor: "#A5F278" }}>
                  {firstLetter}
                </div>
                <span className="text-gray-700 font-medium hidden sm:inline">{userName}님</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg transition-all"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-[#7AADFE] transition-colors"
              >
                로그인
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-5 py-2 text-sm font-bold text-gray-800 rounded-xl shadow-sm transition-transform active:scale-95"
                style={{ backgroundColor: "#A5F278" }}
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;