import React, { useState, useMemo } from 'react';
import { User, AttendanceRecord, Role } from '../types';
import { getRecords, getUsers, saveRecord } from '../services/mockData';
import { Calendar as CalendarIcon, UserX, UserCheck, PlusCircle, Search, ChevronDown, Filter, CheckCircle2 } from 'lucide-react';

interface HistoryProps {
  currentUser: User;
}

export const History: React.FC<HistoryProps> = ({ currentUser }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [justSignedIn, setJustSignedIn] = useState<string | null>(null);

  const users = getUsers();
  const allStudents = users.filter(u => u.role === Role.STUDENT);
  const records = getRecords();

  const recordsForDate = useMemo(() => {
    return records.filter(r => r.date === selectedDate);
  }, [selectedDate, records, refreshTrigger]);

  const presentStudentIds = new Set(recordsForDate.map(r => r.studentId));
  const presentStudents = recordsForDate;
  const absentStudents = allStudents.filter(s => !presentStudentIds.has(s.loginId));

  const filteredPresent = presentStudents.filter(r => r.studentName.includes(searchTerm) || r.studentId.includes(searchTerm));
  const filteredAbsent = absentStudents.filter(s => s.name.includes(searchTerm) || s.loginId.includes(searchTerm));

  const handleManualSignIn = (student: User) => {
    // No longer using alert, straight to action with undo potential (simplified here)
    const record: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: student.loginId,
      studentName: student.name,
      date: selectedDate,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      method: 'MANUAL',
      status: 'PRESENT',
    };
    saveRecord(record);
    setJustSignedIn(student.id);
    setTimeout(() => {
        setRefreshTrigger(prev => prev + 1);
        setJustSignedIn(null);
    }, 500);
  };

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">
             {currentUser.role === Role.TEACHER ? '考勤记录管理' : '我的足迹'}
           </h2>
           <p className="text-slate-500 text-sm mt-1">
             {currentUser.role === Role.TEACHER ? '查看每日出勤详情与管理补签' : '查看个人的历史出勤记录'}
           </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative group w-full md:w-auto">
            <div className="flex items-center justify-between space-x-3 bg-slate-50 hover:bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm group-hover:shadow-md group-hover:border-indigo-300 transition-all cursor-pointer w-full md:w-auto">
              <div className="flex items-center space-x-3">
                  <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
                    <CalendarIcon size={18} />
                  </div>
                  <div className="flex flex-col items-start">
                     <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">当前日期</span>
                     <span className="text-slate-800 font-bold leading-tight">{formatDateDisplay(selectedDate)}</span>
                  </div>
              </div>
              <ChevronDown size={16} className="text-slate-300 group-hover:text-slate-500 ml-2" />
            </div>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
        </div>
      </div>

      {currentUser.role === Role.TEACHER ? (
        <>
          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-5 rounded-2xl border border-green-100 flex items-center justify-between shadow-sm">
               <div>
                 <p className="text-green-600 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">实到人数</p>
                 <p className="text-2xl md:text-3xl font-black text-green-800">{presentStudents.length}</p>
               </div>
               <div className="h-10 w-10 md:h-12 md:w-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600"><UserCheck size={20} className="md:w-6 md:h-6"/></div>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-red-50 p-4 md:p-5 rounded-2xl border border-rose-100 flex items-center justify-between shadow-sm">
               <div>
                 <p className="text-rose-600 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">缺勤人数</p>
                 <p className="text-2xl md:text-3xl font-black text-rose-800">{absentStudents.length}</p>
               </div>
               <div className="h-10 w-10 md:h-12 md:w-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-rose-600"><UserX size={20} className="md:w-6 md:h-6"/></div>
            </div>
            <div className="col-span-2 md:col-span-1 bg-white p-4 md:p-5 rounded-2xl border border-slate-200 flex flex-col justify-center shadow-sm">
               <div className="flex items-center space-x-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                   <Search className="text-slate-400" size={18} />
                   <input 
                     type="text" 
                     placeholder="搜索姓名或学号..." 
                     className="bg-transparent outline-none w-full text-sm font-medium text-slate-700 placeholder-slate-400"
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                   />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Present List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px] md:h-[600px]">
              <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 backdrop-blur">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  <h3 className="font-bold text-slate-800">已签到名单</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg">{filteredPresent.length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-2">
                {filteredPresent.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <Filter size={48} className="mb-4 opacity-10" />
                    <p className="text-sm font-medium">暂无签到记录</p>
                  </div>
                ) : (
                  filteredPresent.map(record => (
                    <div key={record.id} className="p-3 md:p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl transition-all group flex items-center justify-between">
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs md:text-sm border border-slate-200">
                          {record.studentName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{record.studentName}</p>
                          <p className="text-xs text-slate-400 font-mono">{record.studentId}</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                         <p className="text-xs md:text-sm font-bold text-slate-700">{record.timestamp}</p>
                         <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold mt-1 ${
                            record.method === 'QR' ? 'bg-blue-50 text-blue-600' :
                            record.method === 'PASSCODE' ? 'bg-indigo-50 text-indigo-600' :
                            'bg-orange-50 text-orange-600'
                          }`}>
                            {record.method === 'QR' ? '扫码' : record.method === 'PASSCODE' ? '口令' : '补签'}
                          </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Absent List - Enhanced for Supplementary Sign In */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px] md:h-[600px]">
               <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 backdrop-blur">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                  <h3 className="font-bold text-slate-800">缺勤 / 待签到</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg">{filteredAbsent.length}</span>
              </div>

              <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-2">
                 {filteredAbsent.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-emerald-600">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 size={40} className="opacity-80" />
                    </div>
                    <p className="font-bold text-lg">全员已到齐</p>
                    <p className="text-emerald-600/60 text-sm">今日考勤完美结束</p>
                  </div>
                ) : (
                  filteredAbsent.map(student => (
                    <div 
                        key={student.id} 
                        className={`p-3 md:p-4 bg-white border border-slate-100 rounded-xl transition-all flex items-center justify-between ${justSignedIn === student.id ? 'translate-x-full opacity-0 duration-500' : 'hover:border-indigo-200 hover:shadow-sm'}`}
                    >
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs md:text-sm border border-rose-100">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{student.name}</p>
                          <p className="text-xs text-slate-400 font-mono">{student.loginId}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleManualSignIn(student)}
                        className="group flex items-center space-x-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all text-xs font-bold"
                      >
                        <PlusCircle size={14} className="group-hover:scale-110 transition-transform" />
                        <span>确认补签</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        // Student Personal View
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
           {records.filter(r => r.studentId === currentUser.loginId).length === 0 ? (
              <div className="p-20 text-center text-slate-400 flex flex-col items-center">
                 <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <CalendarIcon size={40} className="opacity-30" />
                 </div>
                 <p className="font-medium">暂无考勤记录</p>
                 <p className="text-sm mt-2 opacity-60">您的签到历史将显示在这里</p>
              </div>
           ) : (
             <div className="divide-y divide-slate-100">
                {records
                  .filter(r => r.studentId === currentUser.loginId)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(record => (
                  <div key={record.id} className="p-4 md:p-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
                     <div className="flex items-center space-x-4 md:space-x-5">
                        <div className="flex flex-col items-center justify-center bg-white text-slate-700 w-12 h-12 md:w-16 md:h-16 rounded-2xl border border-slate-200 shadow-sm group-hover:border-indigo-200 group-hover:text-indigo-600 transition-colors">
                           <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{new Date(record.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                           <span className="text-lg md:text-2xl font-black">{new Date(record.date).getDate()}</span>
                        </div>
                        <div>
                           <p className="font-bold text-slate-800 text-base md:text-lg mb-0.5 md:mb-1">{new Date(record.date).toLocaleDateString('zh-CN', { weekday: 'long' })}</p>
                           <div className="flex items-center space-x-2 text-xs md:text-sm text-slate-500">
                                <span className="font-medium">{record.timestamp}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span>已打卡</span>
                           </div>
                        </div>
                     </div>
                     <div>
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold ${
                            record.method === 'QR' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            record.method === 'PASSCODE' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                            'bg-orange-50 text-orange-700 border border-orange-100'
                        }`}>
                           <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                           <span>{record.method === 'QR' ? '扫码' : record.method === 'PASSCODE' ? '口令' : '补签'}</span>
                        </span>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      )}
    </div>
  );
};