import React, { useState } from 'react';
    import { User, AttendanceSession, AttendanceRecord } from '../types';
    import { checkAlreadySignedIn, saveRecord } from '../services/mockData';
    import { QrCode, Type, CheckCircle, AlertCircle, Camera, Check, ChevronRight } from 'lucide-react';
    
    interface StudentCheckInProps {
      user: User;
      session: AttendanceSession | null;
    }
    
    export const StudentCheckIn: React.FC<StudentCheckInProps> = ({ user, session }) => {
      const [inputCode, setInputCode] = useState('');
      const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
      
      const alreadySignedIn = checkAlreadySignedIn(user.loginId);
    
      const handleCheckIn = (method: 'QR' | 'PASSCODE') => {
        if (!session || !session.isActive) {
          setMessage({ type: 'error', text: '当前没有正在进行的签到活动' });
          return;
        }
    
        if (method === 'PASSCODE' && inputCode !== session.code) {
          setMessage({ type: 'error', text: '口令错误，请重试' });
          return;
        }
    
        const record: AttendanceRecord = {
          id: Math.random().toString(36).substr(2, 9),
          studentId: user.loginId,
          studentName: user.name,
          date: new Date().toISOString().split('T')[0],
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          method: method,
          status: 'PRESENT',
        };
    
        saveRecord(record);
        setMessage({ type: 'success', text: '签到成功！' });
      };
    
      const simulateQRScan = () => {
        if (session && session.isActive) {
           handleCheckIn('QR');
        } else {
           setMessage({ type: 'error', text: '无效的二维码' });
        }
      };
    
      if (alreadySignedIn && !message) {
         return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in max-w-md mx-auto">
              <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-8 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-20"></div>
                <Check className="w-16 h-16 text-green-600" strokeWidth={4} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-2">今日已签到</h2>
              <p className="text-slate-500 font-medium">您已完成今日的出勤打卡。</p>
              
              <div className="mt-12 w-full bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex justify-between text-sm text-slate-500 mb-2">
                      <span>学生</span>
                      <span className="font-bold text-slate-800">{user.name}</span>
                  </div>
                   <div className="flex justify-between text-sm text-slate-500">
                      <span>日期</span>
                      <span className="font-bold text-slate-800">{new Date().toLocaleDateString()}</span>
                  </div>
              </div>
            </div>
         );
      }
    
      return (
        <div className="max-w-lg mx-auto space-y-6 pb-12 animate-fade-in">
          <div className="text-center mb-8 pt-4">
            <h2 className="text-2xl font-bold text-slate-800">课堂签到</h2>
            <p className="text-slate-500 text-sm mt-1">请选择一种方式以确认出勤</p>
          </div>
    
          {message && (
            <div className={`p-4 rounded-xl flex items-center space-x-3 shadow-sm animate-pop-in ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {message.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
              <span className="font-bold">{message.text}</span>
            </div>
          )}
    
          {/* Main Actions */}
          <div className="space-y-6">
            
            {/* QR Scanner Card */}
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
               <div className="p-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <QrCode size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">扫码签到</h3>
                            <p className="text-xs text-slate-400">使用摄像头扫描老师展示的二维码</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={simulateQRScan}
                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 group shadow-lg shadow-slate-900/20 active:scale-95"
                    >
                        <Camera size={20} className="group-hover:scale-110 transition-transform" />
                        <span>开启摄像头扫码</span>
                    </button>
               </div>
            </div>

             <div className="flex items-center justify-center space-x-4">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-xs text-slate-400 font-medium">或者</span>
                <div className="h-px bg-slate-200 flex-1"></div>
             </div>
    
            {/* Passcode Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Type size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">口令签到</h3>
                    <p className="text-xs text-slate-400">输入老师口述的 6 位数字口令</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="请输入口令"
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-center font-mono font-bold text-lg tracking-widest text-slate-800 placeholder-slate-300 transition-all"
                  maxLength={6}
                />
                <button
                  onClick={() => handleCheckIn('PASSCODE')}
                  className="px-5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 flex items-center"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    };