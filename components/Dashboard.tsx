import React from 'react';
import { User, Role, AttendanceSession, ViewState } from '../types';
import { getRecords, getUsers } from '../services/mockData';
import { Users, Clock, CheckCircle, XCircle, ChevronRight, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  user: User;
  currentSession: AttendanceSession | null;
  onNavigate: (view: ViewState) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, currentSession, onNavigate }) => {
  const users = getUsers();
  const students = users.filter(u => u.role === Role.STUDENT);
  const records = getRecords();
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = records.filter(r => r.date === today);
  
  const presentCount = todayRecords.length;
  const absentCount = students.length - presentCount;
  const attendanceRate = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, subtext, onClick, action }: any) => (
    <div 
      onClick={onClick}
      className={`bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100 transition-all duration-300 group hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 ${onClick ? 'cursor-pointer hover:border-indigo-200' : ''}`}
    >
      <div className="flex justify-between items-start mb-4 md:mb-6">
        <div className={`p-3 md:p-3.5 rounded-2xl ${bgClass} ${colorClass} group-hover:scale-110 transition-transform`}>
          <Icon size={24} className="md:w-6 md:h-6 w-5 h-5" />
        </div>
        {action && (
            <div className="text-slate-300 group-hover:text-indigo-500 transition-colors">
                <ArrowUpRight size={20} />
            </div>
        )}
      </div>
      <div>
         <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-1 md:mb-2 tracking-tight">{value}</h3>
         <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">{title}</p>
      </div>
      {subtext && <div className="mt-4 md:mt-6 pt-4 border-t border-slate-50 text-xs font-medium text-slate-400">{subtext}</div>}
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-8 animate-fade-in pb-4">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[2rem] p-6 md:p-10 text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500 opacity-20 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3 tracking-tight">早安, {user.name} 老师</h2>
            <p className="text-indigo-100 max-w-xl text-sm md:text-lg opacity-90 leading-relaxed">
                今天是 {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}。
                <br className="md:hidden"/>
                {currentSession?.isActive ? '各项数据显示正常，签到正在进行中。' : '新的一天，准备好开始今天的教学工作了吗？'}
            </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard 
          title="今日出勤率" 
          value={`${attendanceRate}%`} 
          icon={CheckCircle} 
          bgClass="bg-emerald-50"
          colorClass="text-emerald-600" 
          subtext={`${presentCount} 人已到 / 共 ${students.length} 人`}
        />
        <StatCard 
          title="缺勤人数" 
          value={absentCount} 
          icon={XCircle} 
          bgClass="bg-rose-50"
          colorClass="text-rose-600" 
          subtext="需重点关注"
        />
        <StatCard 
          title="学生总数" 
          value={students.length} 
          icon={Users} 
          bgClass="bg-blue-50"
          colorClass="text-blue-600" 
          subtext="班级总人数"
        />
        <StatCard 
          title="签到状态" 
          value={currentSession?.isActive ? '进行中' : '未开始'} 
          icon={Clock} 
          bgClass={currentSession?.isActive ? 'bg-indigo-50' : 'bg-slate-50'}
          colorClass={currentSession?.isActive ? 'text-indigo-600' : 'text-slate-400'} 
          subtext={currentSession?.isActive ? '正在接收数据' : '点击开始签到'}
          onClick={() => !currentSession?.isActive && onNavigate('ATTENDANCE_SETTINGS')}
          action={!currentSession?.isActive}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[400px]">
           <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center">
             <h3 className="font-bold text-slate-800 text-lg md:text-xl">实时动态</h3>
             <button onClick={() => onNavigate('HISTORY')} className="text-sm text-indigo-600 font-bold hover:text-indigo-700 flex items-center bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                查看全部 <ChevronRight size={14} className="ml-1" />
             </button>
           </div>
           
           <div className="flex-1 p-2">
             {todayRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Clock size={24} className="opacity-40" />
                    </div>
                    <p className="font-medium">等待第一位学生签到...</p>
                </div>
             ) : (
                <div className="space-y-2 p-2">
                    {todayRecords.slice(0, 5).reverse().map(record => (
                        <div key={record.id} className="p-4 hover:bg-slate-50 rounded-2xl transition-all flex items-center justify-between group border border-transparent hover:border-slate-100">
                            <div className="flex items-center space-x-4">
                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                                    record.method === 'QR' ? 'bg-blue-50 border-blue-100 text-blue-600' : 
                                    record.method === 'PASSCODE' ? 'bg-purple-50 border-purple-100 text-purple-600' :
                                    'bg-orange-50 border-orange-100 text-orange-600'
                                }`}>
                                    {record.studentName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm md:text-base">{record.studentName}</p>
                                    <p className="text-xs text-slate-400 font-mono mt-0.5">{record.studentId}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs md:text-sm font-bold text-slate-700">{record.timestamp}</p>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full mt-1 inline-block">{
                                    record.method === 'QR' ? '二维码' : 
                                    record.method === 'PASSCODE' ? '口令' : 
                                    '手动补签'
                                }</span>
                            </div>
                        </div>
                    ))}
                </div>
             )}
           </div>
        </div>

        <div className="space-y-4 md:space-y-6">
            <div 
                className="bg-[#1e1b4b] rounded-[2rem] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden group cursor-pointer border border-indigo-900/50 hover:shadow-indigo-900/30 hover:-translate-y-1 transition-all duration-300" 
                onClick={() => onNavigate('RANDOM_CHECK')}
            >
                <div className="absolute -right-10 -top-10 text-indigo-500/10 group-hover:text-indigo-500/20 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110">
                    <Users size={160} className="md:w-[200px] md:h-[200px]" />
                </div>
                <div className="relative z-10">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-500 rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-indigo-500/40">
                        <Users size={20} className="md:w-6 md:h-6" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">课堂抽奖</h3>
                    <p className="text-indigo-200 text-xs md:text-sm mb-6 md:mb-8 leading-relaxed">活跃课堂气氛，随机抽取学生回答问题或参与活动。</p>
                    <div className="flex items-center text-sm font-bold text-indigo-300 group-hover:text-white transition-colors">
                        立即开始 <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>

             <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 md:mb-6 text-lg">快速入口</h3>
                <div className="space-y-3 md:space-y-4">
                   <button onClick={() => onNavigate('STUDENT_MANAGEMENT')} className="w-full text-left p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between group border border-slate-100 hover:shadow-md hover:-translate-y-0.5 duration-200">
                      <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                              <Users size={14} />
                          </div>
                          <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">添加新学生</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
                   </button>
                   <button onClick={() => onNavigate('TEACHER_MANAGEMENT')} className="w-full text-left p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between group border border-slate-100 hover:shadow-md hover:-translate-y-0.5 duration-200">
                      <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                              <Users size={14} />
                          </div>
                          <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">管理教师名单</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
                   </button>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};