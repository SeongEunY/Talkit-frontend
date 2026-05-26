import React, { useState, useEffect } from 'react';
import { MessageCircle, TrendingUp, Settings } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, loginSuccess } from "../../slices/loginSlice";
import axiosInstance from "../../api/axiosInstance";
import RecordsTab from './RecordsTab';
import GrowthTab from './GrowthTab';
import SettingsTab from './SettingsTab';

const MyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userId, email, nickname } = useSelector((state) => state.login);
  const [stats, setStats] = useState(null);

  useEffect (() => {
    if (!userId) return;
    axiosInstance.get('/api/users/my-stats')
    .then(res => setStats(res.data))
    .catch(err => console.error('stats 로드 실패',err));
  },[userId]);

  const emotionData = stats ? [
    {name: '긍정적', value: stats.positiveCount || 0, color: '#10B981'},
    {name: '보통', value: stats.normalCount || 0, color: '#6B7280'},
    {name: '부정적', value: stats.negativeCount || 0, color: '#EF4444'},
  ] : [];


  const currentUser = { userId, email, nickname };

  const [activeTab, setActiveTab] = useState('records');
  const [showSettings, setShowSettings] = useState({
    notifications: true,
    soundAlerts: false,
    dataAnalytics: true
  });
  

  const growthData = stats?.monthlyTemperatures?.length > 0
  ? stats.monthlyTemperatures.map(item => ({
      month: item.month,      
      score: item.avgTemp,
    }))
  : [];

  const handleUpdateNickname = async (updatedNickname) => {
    try {
      const response = await axiosInstance.patch('/api/users/nickname', { nickname: updatedNickname });
      dispatch(loginSuccess({ userId, email, nickname: response.data.data }));
      alert("닉네임이 수정되었습니다.");
    } catch (error) {
      alert("수정 중 오류가 발생했습니다.", error);
    }
  };

  const handleLogout = async () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      try { 
        await axiosInstance.post('/api/users/logout'); 
      } catch (error) {
        console.error("로그아웃 실패:", error);
      } finally {
        dispatch(logout());
        navigate("/");
      }
    }
  };

  // --- UI 헬퍼 ---
  const TabButton = ({ icon: Icon, title, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
        isActive ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{title}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-gray-700 font-bold text-2xl shadow-sm" style={{ backgroundColor: "#A5F278" }}>
              {nickname?.charAt(0) || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">안녕하세요, {nickname || "사용자"}님!</h1>
              <p className="text-gray-600">오늘도 즐거운 대화를 나눠보세요</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">{stats ? `${stats.temperature}°C` : ''} </div>
          </div>
        </div>

        {/* 탭 버튼 */}
        <div className="flex space-x-2 mb-6 bg-white rounded-xl p-2 shadow-lg">
          <TabButton icon={MessageCircle} title="기록/피드백" isActive={activeTab === 'records'} onClick={() => setActiveTab('records')} />
          <TabButton icon={TrendingUp} title="성장/대시보드" isActive={activeTab === 'growth'} onClick={() => setActiveTab('growth')} />
          <TabButton icon={Settings} title="설정/계정관리" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </div>

        {/* 탭 컨텐츠 */}
        <main>
          {activeTab === 'records' && (
            <RecordsTab/>
          )}
          {activeTab === 'growth' && (
            <GrowthTab 
              growthData={growthData} 
              emotionData={emotionData} 
              userId={userId} 
            />
          )}
          {activeTab === 'settings' && (
            <SettingsTab 
              user={currentUser}
              showSettings={showSettings}
              setShowSettings={setShowSettings}
              handleUpdateNickname={handleUpdateNickname}
              handleLogout={handleLogout}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default MyPage;