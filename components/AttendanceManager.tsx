import React, { useState, useEffect } from 'react';
import { AttendanceSession } from '../types';
import { QrCode, Type, RefreshCw, Maximize2, Power, Lock, Check, Smartphone, X } from 'lucide-react';

interface AttendanceManagerProps {
  session: AttendanceSession | null;
  onUpdateSession: (session: AttendanceSession | null) => void;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({ session, onUpdateSession }) => {
  const [passcode, setPasscode] = useState('');
  const [isExpandedQR, setIsExpandedQR] = useState(false);
  const [useQR, setUseQR] = useState(true);
  const [usePasscode, setUsePasscode] = useState(true);

  useEffect(() => {
    if (session) {
      setPasscode(session.code);
      setUseQR(session.type === 'QR' || session.type === 'BOTH');
      setUsePasscode(session.type === 'PASSCODE' || session.type === 'BOTH');
    } else {
        if (!passcode) generateCode();
    }
  }, [session]);

  const generateCode = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setPasscode(randomCode);
  };

  const startSession = () => {
    if (!useQR && !usePasscode) {
        alert("请至少选择一种签到方式");
        return;
    }
    const qrData = `SMARTATTEND_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    let type: 'QR' | 'PASSCODE' | 'BOTH' = 'BOTH';
    if (useQR && !usePasscode) type = 'QR';
    if (!useQR && usePasscode) type = 'PASSCODE';

    const newSession: AttendanceSession = {
      isActive: true,
      type: type,
      code: passcode || '123456',
      qrValue: qrData,
      startTime: Date.now(),
    };
    onUpdateSession(newSession);
  };

  const stopSession = () => {
    onUpdateSession(null);
    setIsExpandedQR(false);
  };

  const refreshQR = () => {
    if (session) {
      const qrData = `SMARTATTEND_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      onUpdateSession({ ...session, qrValue: qrData });
    }
  };

  const getQRUrl = (data: string, size: number) => 
    `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&color=0f172a&bgcolor=ffffff`;

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-fade-in pb-4">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">签到设置</h2>
          <p className="text-slate-500 mt-1 text-sm">配置签到方式并开始接收学生考勤。</p>
        </div>
        
        {session?.isActive ? (
          <button 
            onClick={stopSession}
            className="w-full lg:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors font-bold shadow-sm"
          >
            <Power size={20} />
            <span>结束当前签到</span>
          </button>
        ) : (
          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-4">
             <div className="w-full sm:w-auto flex items-center justify-center bg-slate-50 rounded-xl p-1 border border-slate-200">
                <label className={`flex-1 flex items-center justify-center space-x-2 cursor-pointer px-4 py-2.5 rounded-lg transition-all ${usePasscode ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
                    <input type="checkbox" checked={usePasscode} onChange={e => setUsePasscode(e.target.checked)} className="hidden" />
                    <span className="text-sm font-bold">口令</span>
                    {usePasscode && <Check size={14} strokeWidth={3} />}
                </label>
                <div className="w-px bg-slate-200 h-4 mx-1"></div>
                <label className={`flex-1 flex items-center justify-center space-x-2 cursor-pointer px-4 py-2.5 rounded-lg transition-all ${useQR ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                    <input type="checkbox" checked={useQR} onChange={e => setUseQR(e.target.checked)} className="hidden" />
                    <span className="text-sm font-bold">二维码</span>
                    {useQR && <Check size={14} strokeWidth={3} />}
                </label>
             </div>
            <button 
                onClick={startSession}
                disabled={!useQR && !usePasscode}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 font-bold disabled:opacity-50 disabled:shadow-none transform active:scale-95"
            >
                <Power size={18} />
                <span>立即开始</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Passcode Card */}
        <div className={`relative overflow-hidden bg-white rounded-3xl shadow-sm border transition-all duration-300 group ${session?.isActive && (session.type === 'PASSCODE' || session.type === 'BOTH') ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'border-slate-200'}`}>
          <div className="p-6 md:p-8 relative z-10">
            <div className="flex items-center space-x-4 mb-6 md:mb-8">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-colors ${session?.isActive && (session.type === 'PASSCODE' || session.type === 'BOTH') ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>
                <Type size={20} className="md:w-6 md:h-6" />
              </div>
              <div>
                 <h3 className="text-lg md:text-xl font-bold text-slate-800">口令签到</h3>
                 <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${session?.isActive && (session.type === 'PASSCODE' || session.type === 'BOTH') ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                    <span>{session?.isActive && (session.type === 'PASSCODE' || session.type === 'BOTH') ? '正在广播' : '等待启动'}</span>
                 </div>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-6 md:p-8 text-center border border-slate-200 mb-6 md:mb-8 relative group-hover:border-indigo-200 transition-colors">
               <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  disabled={session?.isActive}
                  className="w-full bg-transparent text-center text-5xl md:text-6xl font-mono font-black tracking-[0.2em] text-slate-800 outline-none placeholder-slate-200"
                  maxLength={6}
                />
                <p className="text-xs text-slate-400 mt-4 font-bold uppercase tracking-widest">Access Code</p>
                {!session?.isActive && (
                    <button 
                        onClick={generateCode} 
                        className="absolute top-2 right-2 md:top-4 md:right-4 p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                        title="重新生成"
                    >
                        <RefreshCw size={16} />
                    </button>
                )}
            </div>
          </div>
          {!usePasscode && !session?.isActive && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-20">
                  <div className="bg-white px-5 py-3 rounded-full shadow-lg border border-slate-100 flex items-center space-x-2 text-slate-500">
                      <Lock size={16} />
                      <span className="text-sm font-bold">此模式未启用</span>
                  </div>
              </div>
          )}
        </div>

        {/* QR Card */}
        <div className={`relative overflow-hidden bg-white rounded-3xl shadow-sm border transition-all duration-300 ${session?.isActive && (session.type === 'QR' || session.type === 'BOTH') ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' : 'border-slate-200'}`}>
          <div className="p-6 md:p-8 relative z-10 flex flex-col h-full">
             <div className="flex items-center space-x-4 mb-6 md:mb-8">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-colors ${session?.isActive && (session.type === 'QR' || session.type === 'BOTH') ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>
                <QrCode size={20} className="md:w-6 md:h-6" />
              </div>
              <div>
                 <h3 className="text-lg md:text-xl font-bold text-slate-800">二维码签到</h3>
                 <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${session?.isActive && (session.type === 'QR' || session.type === 'BOTH') ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                    <span>{session?.isActive && (session.type === 'QR' || session.type === 'BOTH') ? '正在显示' : '等待启动'}</span>
                 </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center min-h-[220px] bg-slate-50 rounded-2xl border border-slate-200 relative group overflow-hidden">
               {session?.isActive && (session.type === 'QR' || session.type === 'BOTH') ? (
                  <>
                     <div className="relative p-4 bg-white rounded-xl shadow-sm cursor-zoom-in" onClick={() => setIsExpandedQR(true)}>
                        <img 
                            src={getQRUrl(session.qrValue, 250)} 
                            alt="QR Code" 
                            className="mix-blend-multiply w-40 h-40 md:w-48 md:h-48 object-contain"
                        />
                     </div>
                     <div className="absolute bottom-4 right-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setIsExpandedQR(true)} className="p-2.5 bg-white rounded-xl shadow-md text-slate-600 hover:text-blue-600 border border-slate-100">
                            <Maximize2 size={18} />
                        </button>
                     </div>
                     <div className="absolute bottom-4 left-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                         <button onClick={refreshQR} className="p-2.5 bg-white rounded-xl shadow-md text-slate-600 hover:text-blue-600 border border-slate-100">
                            <RefreshCw size={18} />
                        </button>
                     </div>
                  </>
               ) : (
                   <div className="text-center text-slate-300">
                      <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-dashed border-slate-200 rounded-xl mx-auto mb-3 flex items-center justify-center">
                         <QrCode size={32} />
                      </div>
                      <p className="text-sm font-medium">二维码将在此处显示</p>
                   </div>
               )}
            </div>
          </div>
          {!useQR && !session?.isActive && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-20">
                  <div className="bg-white px-5 py-3 rounded-full shadow-lg border border-slate-100 flex items-center space-x-2 text-slate-500">
                      <Lock size={16} />
                      <span className="text-sm font-bold">此模式未启用</span>
                  </div>
              </div>
          )}
        </div>
      </div>

      {/* Expanded QR Modal - Optimized Size */}
      {isExpandedQR && session && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full h-full flex flex-col items-center justify-center">
             
             <button 
                onClick={() => setIsExpandedQR(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-4 bg-white/10 text-white hover:bg-white/20 rounded-full transition-colors z-50"
             >
                <X size={32} />
             </button>

             <div className="text-center mb-4 md:mb-8">
                 <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">扫码签到</h2>
                 <p className="text-slate-300 text-sm md:text-lg">请使用移动设备扫描下方二维码</p>
             </div>

             <div className="bg-white p-2 md:p-4 rounded-3xl shadow-2xl animate-pop-in max-w-[90vw] max-h-[70vh] flex items-center justify-center">
                 <img 
                    src={getQRUrl(session.qrValue, 800)} 
                    alt="Large QR" 
                    className="object-contain w-auto h-auto max-w-full max-h-[65vh]"
                 />
             </div>
             
             <div className="mt-6 md:mt-10 flex space-x-6">
                <button 
                  onClick={refreshQR}
                  className="flex items-center space-x-3 px-6 py-3 md:px-8 md:py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30 text-base md:text-lg"
                >
                  <RefreshCw size={20} />
                  <span>刷新二维码</span>
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};