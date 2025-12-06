import React, { useState, useEffect } from 'react';
import { getUsers, getLastLogin, saveLastLogin, clearLastLogin } from '../services/mockData';
import { User, Role } from '../types';
import { UserCheck, ShieldCheck, GraduationCap, Zap, ChevronRight, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [name, setName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [error, setError] = useState('');
  const [lastUser, setLastUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = getLastLogin();
    if (saved) {
      setLastUser(saved);
    }
  }, []);

  const handleLogin = (e?: React.FormEvent, overrideUser?: User) => {
    if (e) e.preventDefault();
    const users = getUsers();
    
    const targetName = overrideUser ? overrideUser.name : name;
    const targetId = overrideUser ? overrideUser.loginId : loginId;
    const targetRole = overrideUser ? overrideUser.role : role;

    const user = users.find(
      u => u.name === targetName && u.loginId === targetId && u.role === targetRole
    );

    if (user) {
      saveLastLogin(user);
      onLogin(user);
    } else {
      if (overrideUser) {
        clearLastLogin();
        setLastUser(null);
        setError('该快捷账户已失效');
      } else {
        setError('用户信息不匹配，请检查姓名和ID');
      }
    }
  };

  const quickFill = (type: Role) => {
    const users = getUsers();
    const demoUser = users.find(u => u.role === type);
    if (demoUser) {
      setRole(type);
      setName(demoUser.name);
      setLoginId(demoUser.loginId);
      setError('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0f172a]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-indigo-500/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] bg-blue-500/20 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md p-6 relative z-10 animate-pop-in">
        <div className="glass-dark rounded-3xl shadow-2xl shadow-indigo-500/10 overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-0 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-6">
              <UserCheck className="text-white h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">到了吗</h1>
            <p className="text-slate-400 text-sm">新一代智能校园考勤系统</p>
          </div>

          <div className="p-8">
            {/* Quick Login Card */}
            {lastUser && !name && (
              <div className="mb-8 p-1 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                <div className="bg-[#1e293b]/80 backdrop-blur-sm p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                      {lastUser.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium text-sm">欢迎回来, {lastUser.name}</p>
                      <p className="text-slate-400 text-xs">{lastUser.role === Role.TEACHER ? '教师' : '学生'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleLogin(undefined, lastUser)}
                    className="group bg-white text-indigo-900 hover:bg-indigo-50 text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center space-x-1"
                  >
                    <span>登录</span>
                    <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Role Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800/50 rounded-xl mb-8 border border-slate-700/50">
              <button
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  role === Role.TEACHER 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
                onClick={() => { setRole(Role.TEACHER); setError(''); }}
              >
                <ShieldCheck size={16} />
                <span>我是教师</span>
              </button>
              <button
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  role === Role.STUDENT 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
                onClick={() => { setRole(Role.STUDENT); setError(''); }}
              >
                <GraduationCap size={16} />
                <span>我是学生</span>
              </button>
            </div>

            <form onSubmit={(e) => handleLogin(e)} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 ml-1">姓名</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === Role.TEACHER ? "请输入您的姓名" : "请输入您的姓名"}
                  className="w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 ml-1">{role === Role.TEACHER ? '工号' : '学号'}</label>
                <input
                  type="text"
                  required
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder={role === Role.TEACHER ? "T1001" : "S2023..."}
                  className="w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-3 rounded-lg animate-fade-in">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 active:scale-[0.98] mt-2"
              >
                立即登录
              </button>
            </form>
            
            {/* Quick Fill (Hidden/Subtle) */}
            <div className="mt-8 flex justify-center space-x-4 opacity-40 hover:opacity-100 transition-opacity">
                <button onClick={() => quickFill(Role.TEACHER)} className="flex items-center space-x-1 text-[10px] text-slate-400 hover:text-white px-2 py-1 rounded border border-slate-700">
                    <Zap size={10} /> <span>Teacher Demo</span>
                </button>
                <button onClick={() => quickFill(Role.STUDENT)} className="flex items-center space-x-1 text-[10px] text-slate-400 hover:text-white px-2 py-1 rounded border border-slate-700">
                    <Zap size={10} /> <span>Student Demo</span>
                </button>
            </div>
          </div>
        </div>
        
        <p className="text-center text-slate-500 text-xs mt-6 font-medium">
            &copy; {new Date().getFullYear()} 到了吗 SmartAttend System
        </p>
      </div>
    </div>
  );
};