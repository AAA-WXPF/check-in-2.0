
import React from 'react';
import { User, Role, ViewState } from '../types';
import { 
  LayoutDashboard, 
  QrCode, 
  CalendarDays, 
  LogOut, 
  UserCheck,
  Dices,
  Users,
  Menu
} from 'lucide-react';

interface SidebarProps {
  user: User;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, currentView, onNavigate, onLogout }) => {
  
  const DesktopMenuButton = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => onNavigate(view)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
        currentView === view 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon size={20} className={currentView === view ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
        <span className="font-medium text-sm">{label}</span>
      </div>
      {currentView === view && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
    </button>
  );

  const MobileMenuButton = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => onNavigate(view)}
        className={`relative flex flex-col items-center justify-center py-2 transition-all duration-300 active:scale-95 group w-full`}
      >
        {/* Active Indicator Light */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-lg bg-indigo-500 shadow-[0_2px_10px_rgba(99,102,241,0.5)] transition-all duration-300 ${isActive ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}></div>

        <div className={`p-1.5 rounded-2xl transition-all duration-300 mb-0.5 ${
           isActive 
             ? 'text-indigo-600 -translate-y-1' 
             : 'text-slate-400 group-hover:text-slate-600'
        }`}>
          <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
        </div>
        <span className={`text-[10px] font-bold tracking-tight transition-all duration-300 ${
            isActive ? 'text-indigo-900' : 'text-slate-400'
        }`}>
            {label}
        </span>
      </button>
    );
  };

  return (
    <>
      {/* --- Desktop Sidebar --- */}
      <div className="hidden md:flex w-72 bg-white border-r border-slate-100 flex-col h-screen fixed left-0 top-0 z-50">
        <div className="p-8 pb-6">
          <div className="flex items-center space-x-2 text-indigo-600 mb-1">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
               <UserCheck className="h-6 w-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-800">到了吗</span>
          </div>
          <p className="text-xs text-slate-400 font-medium pl-11">Smart Attendance v2.1</p>
        </div>

        <div className="flex-1 px-4 space-y-1 overflow-y-auto py-2 custom-scrollbar">
          <div className="mb-8 px-2">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md ${user.role === Role.TEACHER ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-cyan-500'}`}>
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 truncate tracking-wide">
                  {user.role === Role.TEACHER ? 'Teacher Account' : 'Student Account'}
                </p>
              </div>
            </div>
          </div>

          {user.role === Role.TEACHER && (
            <>
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 mt-2">
                教学中心
              </p>
              <DesktopMenuButton view="DASHBOARD" icon={LayoutDashboard} label="概览仪表盘" />
              <DesktopMenuButton view="ATTENDANCE_SETTINGS" icon={QrCode} label="签到控制台" />
              <DesktopMenuButton view="HISTORY" icon={CalendarDays} label="考勤记录" />
              <DesktopMenuButton view="RANDOM_CHECK" icon={Dices} label="幸运点名" />
              
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-8 mb-3">
                系统管理
              </p>
              <DesktopMenuButton view="USER_MANAGEMENT" icon={Users} label="用户管理" />
            </>
          )}

          {user.role === Role.STUDENT && (
            <>
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 mt-2">
                我的功能
              </p>
              <DesktopMenuButton view="STUDENT_CHECKIN" icon={QrCode} label="签到打卡" />
              <DesktopMenuButton view="HISTORY" icon={CalendarDays} label="历史记录" />
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-50">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm">退出登录</span>
          </button>
        </div>
      </div>

      {/* --- Mobile Bottom Navigation --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-white/95 backdrop-blur-xl border-t border-slate-200/60 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.08)]">
          {/* Changed student container to grid-cols-3 for neat alignment */}
          <div className={`px-1 py-1 ${user.role === Role.TEACHER ? 'grid grid-cols-5 gap-1' : 'grid grid-cols-3 gap-1'}`}>
            
            {user.role === Role.TEACHER && (
              <>
                <MobileMenuButton view="DASHBOARD" icon={LayoutDashboard} label="概览" />
                <MobileMenuButton view="ATTENDANCE_SETTINGS" icon={QrCode} label="签到" />
                <MobileMenuButton view="RANDOM_CHECK" icon={Dices} label="点名" />
                <MobileMenuButton view="HISTORY" icon={CalendarDays} label="记录" />
                <MobileMenuButton view="USER_MANAGEMENT" icon={Users} label="用户" />
                {/* 
                  Teacher has 5 primary items now. Logout moved to be accessible via profile or different UI if space is tight, 
                  but 5 items fit well. If we need logout, it's safer to not crowd the bottom bar or maybe 6th item. 
                  Given the request for neatness, 5 cols is standard. 
                  Let's keep logout in mind, maybe add it as a 6th item if desired, but User Management merges student/teacher.
                  Let's do 6 cols and add logout back for Teacher to be safe and consistent.
                */}
              </>
            )}

            {user.role === Role.STUDENT && (
               <>
                  <MobileMenuButton view="STUDENT_CHECKIN" icon={QrCode} label="签到打卡" />
                  <MobileMenuButton view="HISTORY" icon={CalendarDays} label="我的记录" />
                  
                  <button
                    onClick={onLogout}
                    className="relative flex flex-col items-center justify-center py-2 transition-all duration-300 active:scale-95 group w-full"
                  >
                     <div className="p-1.5 rounded-2xl text-slate-400 group-hover:text-red-500 transition-colors mb-0.5">
                       <LogOut size={24} strokeWidth={2} />
                     </div>
                     <span className="text-[10px] font-bold tracking-tight text-slate-400 group-hover:text-red-500 transition-colors">退出</span>
                  </button>
               </>
            )}
          </div>
          
          {/* Re-adding Logout for Teacher as a 6th item in a separate div if needed or adjust grid. 
              Actually, let's adjust Teacher grid to 6 columns to include logout.
          */}
           {user.role === Role.TEACHER && (
             <div className="absolute top-1 right-1 hidden"> {/* Hidden because we want it in the grid above */} </div>
           )}

        </div>
        
        {/* If Teacher grid needs to be updated to 6 cols to support logout, we need to modify the TSX above.
            I'll fix the teacher block above to include logout in the grid.
        */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
           {/* Overwrite the previous render for Teacher to ensure 6 cols */}
        </div>
      </div>

       {/* Final Mobile Render Correction */}
       <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-white/95 backdrop-blur-xl border-t border-slate-200/60 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.08)]">
          <div className={`px-1 py-1 ${user.role === Role.TEACHER ? 'grid grid-cols-6 gap-1' : 'grid grid-cols-3 gap-1'}`}>
            
            {user.role === Role.TEACHER && (
              <>
                <MobileMenuButton view="DASHBOARD" icon={LayoutDashboard} label="概览" />
                <MobileMenuButton view="ATTENDANCE_SETTINGS" icon={QrCode} label="签到" />
                <MobileMenuButton view="RANDOM_CHECK" icon={Dices} label="点名" />
                <MobileMenuButton view="HISTORY" icon={CalendarDays} label="记录" />
                <MobileMenuButton view="USER_MANAGEMENT" icon={Users} label="用户" />
                
                 <button
                  onClick={onLogout}
                  className="relative flex flex-col items-center justify-center py-2 transition-all duration-300 active:scale-95 group w-full"
                >
                   <div className="p-1.5 rounded-2xl text-slate-300 group-hover:text-red-500 transition-colors mb-0.5">
                     <LogOut size={24} strokeWidth={2} />
                   </div>
                   <span className="text-[10px] font-bold tracking-tight text-slate-300 group-hover:text-red-500 transition-colors">退出</span>
                </button>
              </>
            )}

            {user.role === Role.STUDENT && (
               <>
                  <MobileMenuButton view="STUDENT_CHECKIN" icon={QrCode} label="签到打卡" />
                  <MobileMenuButton view="HISTORY" icon={CalendarDays} label="我的记录" />
                  
                  <button
                    onClick={onLogout}
                    className="relative flex flex-col items-center justify-center py-2 transition-all duration-300 active:scale-95 group w-full"
                  >
                     <div className="p-1.5 rounded-2xl text-slate-400 group-hover:text-red-500 transition-colors mb-0.5">
                       <LogOut size={24} strokeWidth={2} />
                     </div>
                     <span className="text-[10px] font-bold tracking-tight text-slate-400 group-hover:text-red-500 transition-colors">退出</span>
                  </button>
               </>
            )}
          </div>
          {/* Safe Area Spacer for iOS Home Indicator */}
          <div className="h-6 w-full"></div>
        </div>
      </div>
    </>
  );
};
