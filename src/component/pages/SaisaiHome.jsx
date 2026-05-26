import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from "../../api/axiosInstance";
import { Home, MessageCircle, BarChart3, User, Play, Search, Bell, Award, Calendar, Sparkles } from 'lucide-react';

const SaisaiHome = () => {
  const [recentStats, setRecentStats] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [completedGoals, setCompletedGoals] = useState([true, false, false]);
  const [timeOfDay, setTimeOfDay] = useState('');
  const { isLoggedIn } = useSelector((state) => state.login);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchStats = async () => {
        try {
          const response = await axiosInstance.get('/api/stats/recent');
          setRecentStats(response.data);
        } catch (error) {
          console.error("통계 로딩 실패:", error);
        }
      };
      fetchStats();
    };
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('아침');
    else if (hour < 18) setTimeOfDay('오후');
    else setTimeOfDay('저녁');
  }, [isLoggedIn]);

  const todaysKeywords = [
    { keyword: '날씨', color: 'bg-blue-200', emoji: '☀️', completed: true },
    { keyword: '음식', color: 'bg-orange-200', emoji: '🍜', completed: true },
    { keyword: '감정', color: 'bg-purple-200', emoji: '💭', completed: false },
    { keyword: '취미', color: 'bg-green-200', emoji: '🎨', completed: false },
    { keyword: '계획', color: 'bg-red-200', emoji: '📅', completed: false }
  ];

  const moods = [
    { emoji: '😊', label: '즐거워요', value: 'happy' },
    { emoji: '😐', label: '그냥 그래요', value: 'neutral' },
    { emoji: '😞', label: '우울해요', value: 'sad' },
    { emoji: '🥺', label: '답답해요', value: 'frustrated' },
    { emoji: '😠', label: '화나요', value: 'angry' }
  ];


  const todaysGoals = [
    '2턴 이상 대화하기',
    '감정 키워드 2개 성공',
    '새로운 사람과 대화하기'
  ];

  const recentAchievements = [
    { title: '첫 대화 완주', date: '어제', emoji: '🏆' },
    { title: '감정 마스터', date: '2일 전', emoji: '💝' },
    { title: '주간 챔피언', date: '3일 전', emoji: '🌟' }
  ];

  const completedCount = completedGoals.filter((_, index) => completedGoals[index]).length;
  const completionRate = Math.round((completedCount / todaysGoals.length) * 100);

  const toggleGoal = (index) => {
    const newCompletedGoals = [...completedGoals];
    newCompletedGoals[index] = !newCompletedGoals[index];
    setCompletedGoals(newCompletedGoals);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 메인 히어로 섹션 - 그라데이션 변경 */}
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-2xl p-12 mb-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-2">{timeOfDay}의 대화를</h2>
            <h2 className="text-4xl font-bold mb-6">시작해보세요</h2>
            <p className="text-purple-100 mb-8 text-lg">새로운 사람들과 의미있는 대화를 나눠보세요</p>
            <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-50 transition-colors">
              <div className="flex items-center space-x-2">
                <Play size={20} />
                <span>지금 말잇기 시작</span>
              </div>
            </button>
          </div>
          <div className="absolute right-8 top-8 w-48 h-64 bg-yellow-400 rounded-2xl transform rotate-12 opacity-20"></div>
          <div className="absolute right-16 bottom-8 w-32 h-40 bg-blue-400 rounded-2xl transform -rotate-12 opacity-20"></div>
        </div>

        {/* 키워드 섹션 - 이모지 + 컬러 배경 조합 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">오늘의 미션</h3>
              <p className="text-gray-600">키워드를 대화에 자연스럽게 넣어보세요</p>
            </div>
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              5개 중 2개 완료
            </div>
          </div>

          <div className="grid grid-cols-5 gap-6">
            {todaysKeywords.map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200 hover:-translate-y-1">
                  <div className="text-center">
                    <div className={`w-16 h-16 ${item.color} rounded-2xl mb-4 mx-auto flex items-center justify-center relative overflow-hidden`}>
                      <div className="text-2xl relative z-10">{item.emoji}</div>
                      <div className="absolute inset-0 bg-white bg-opacity-20 rounded-2xl"></div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.keyword}</h4>
                    <div className={`text-xs font-medium ${item.completed ? 'text-green-600' : 'text-gray-500'}`}>
                      {item.completed ? '완료' : '미완료'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 감정, 통계, 성취도 섹션 */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* 감정 선택 */}
          <div className="md:col-span-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">지금 기분이 어떠세요?</h3>
            <div className="grid grid-cols-5 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-3 rounded-xl transition-all duration-200 text-center border-2 ${
                    selectedMood === mood.value 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="text-xs text-gray-600 font-medium">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 최근 기록 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">최근 활동</h3>
            <div className="space-y-4">
              {recentStats.map((stat, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">{stat.label}</span>
                    <span className="font-bold text-gray-900">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 최근 성취도 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span>최근 성취</span>
            </h3>
            <div className="space-y-4">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-xl">
                  <div className="text-2xl">{achievement.emoji}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{achievement.title}</div>
                    <div className="text-xs text-gray-500">{achievement.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오늘의 목표 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">오늘의 목표</h3>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-bold text-green-600">{completedCount}</span>/{todaysGoals.length} 완료 
                <span className="ml-2 text-green-600 font-medium">({completionRate}%)</span>
              </div>
              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-400 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            {todaysGoals.map((goal, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <button
                  onClick={() => toggleGoal(index)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    completedGoals[index] 
                      ? 'border-2' 
                      : 'border-gray-300'
                  }`}
                  style={completedGoals[index] 
                    ? {backgroundColor: '#A5F278', borderColor: '#A5F278'}
                    : {}}
                  onMouseEnter={(e) => {
                    if (!completedGoals[index]) {
                      e.target.style.borderColor = '#A5F278';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!completedGoals[index]) {
                      e.target.style.borderColor = '#d1d5db';
                    }
                  }}
                >
                  {completedGoals[index] && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <span className={`font-medium ${completedGoals[index] ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {goal}
                </span>
                {completedGoals[index] && (
                  <span className="ml-auto text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">완료</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaisaiHome;