import React, { useState, useEffect, useRef } from 'react';
import { getUsers } from '../services/mockData';
import { Role, User } from '../types';
import { Sparkles, Trophy, Zap } from 'lucide-react';

export const RandomCall: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayUser, setDisplayUser] = useState<{name: string, id: string}>({name: '准备就绪', id: '---'});
  
  // Confetti state
  const [confetti, setConfetti] = useState<{id: number, x: number, y: number, color: string, delay: number}[]>([]);

  useEffect(() => {
    const allUsers = getUsers();
    setStudents(allUsers.filter(u => u.role === Role.STUDENT));
  }, []);

  const triggerConfetti = () => {
    const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
    const newConfetti = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * 100, // percentage
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5
    }));
    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 3000);
  };

  const startRandomPick = () => {
    if (students.length === 0) return;
    
    setIsAnimating(true);
    setSelectedStudent(null);
    setConfetti([]);
    
    let duration = 0;
    const initialSpeed = 50;
    let currentSpeed = initialSpeed;
    
    // Recursive timeout loop to simulate slowing down
    const roll = () => {
      const randomIndex = Math.floor(Math.random() * students.length);
      const randomStudent = students[randomIndex];
      setDisplayUser({ name: randomStudent.name, id: randomStudent.loginId });

      duration += currentSpeed;
      
      if (duration < 2500) {
        // Keep rolling at constant speed
        setTimeout(roll, 50);
      } else if (duration < 3500) {
        // Slow down
        currentSpeed += 20;
        setTimeout(roll, currentSpeed);
      } else {
        // Stop
        const finalIndex = Math.floor(Math.random() * students.length);
        const winner = students[finalIndex];
        setDisplayUser({ name: winner.name, id: winner.loginId });
        setSelectedStudent(winner);
        setIsAnimating(false);
        triggerConfetti();
      }
    };

    roll();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-3xl w-full space-y-6 md:space-y-8 text-center relative z-10">
        <div className="mb-4 md:mb-8">
           <h2 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2 md:gap-3">
             <Zap className="text-yellow-500 fill-yellow-500 w-6 h-6 md:w-8 md:h-8" />
             幸运点名时刻
             <Zap className="text-yellow-500 fill-yellow-500 w-6 h-6 md:w-8 md:h-8" />
           </h2>
           <p className="text-slate-500 mt-2 font-medium text-sm md:text-base">从 {students.length} 位同学中随机抽取</p>
        </div>

        {/* The Card */}
        <div className="relative">
          {/* Glowing border effect */}
          {isAnimating && (
             <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-[2.5rem] blur opacity-75 animate-pulse"></div>
          )}
          
          <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 p-8 md:p-16 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px]">
            
            {/* Confetti Rendering */}
            {confetti.map((c) => (
              <div 
                key={c.id}
                className="absolute w-3 h-3 rounded-full animate-ping opacity-75"
                style={{
                  left: `${c.x}%`,
                  top: `${c.y}%`,
                  backgroundColor: c.color,
                  animationDelay: `${c.delay}s`,
                  animationDuration: '1s'
                }}
              />
            ))}

            <div className="mb-6 md:mb-8">
               {selectedStudent ? (
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-full flex items-center justify-center shadow-lg animate-float">
                      <Trophy size={32} className="md:w-12 md:h-12 fill-white" />
                  </div>
               ) : (
                  <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-inner ${isAnimating ? 'bg-indigo-100 text-indigo-500 animate-spin' : 'bg-slate-100 text-slate-400'}`}>
                      <Sparkles size={32} className="md:w-10 md:h-10" />
                  </div>
               )}
            </div>

            <div className="space-y-4">
               <div className={`text-4xl md:text-7xl font-black transition-all duration-100 ${isAnimating ? 'blur-[1px] text-slate-700' : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 scale-110'}`}>
                  {displayUser.name}
               </div>
               <div className="text-lg md:text-2xl text-slate-400 font-mono bg-slate-100 px-4 py-1 md:px-6 md:py-2 rounded-full inline-block">
                 {displayUser.id}
               </div>
            </div>
            
            {selectedStudent && (
               <div className="mt-6 md:mt-8 animate-pop-in">
                 <span className="px-4 py-1.5 md:px-6 md:py-2 bg-green-100 text-green-700 rounded-full font-bold text-sm md:text-lg border border-green-200 shadow-sm">
                   🎉 恭喜中奖！
                 </span>
               </div>
            )}
          </div>
        </div>

        <button
          onClick={startRandomPick}
          disabled={isAnimating || students.length === 0}
          className="group relative inline-flex items-center justify-center px-10 py-4 md:px-12 md:py-5 text-base md:text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-xl hover:shadow-2xl hover:translate-y-[-2px] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
           <span className="mr-3">{isAnimating ? '滚动中...' : '开始点名'}</span>
           {!isAnimating && <Sparkles className="w-5 h-5 group-hover:animate-spin" />}
        </button>
      </div>
    </div>
  );
};