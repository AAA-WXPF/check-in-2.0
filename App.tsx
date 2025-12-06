
import React, { useState } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AttendanceManager } from './components/AttendanceManager';
import { StudentCheckIn } from './components/StudentCheckIn';
import { History } from './components/History';
import { UserManagement } from './components/UserManagement';
import { RandomCall } from './components/RandomCall';
import { User, Role, ViewState, AttendanceSession } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('LOGIN');
  const [currentSession, setCurrentSession] = useState<AttendanceSession | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView(user.role === Role.TEACHER ? 'DASHBOARD' : 'STUDENT_CHECKIN');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('LOGIN');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return currentUser ? <Dashboard user={currentUser} currentSession={currentSession} onNavigate={setCurrentView} /> : null;
      case 'ATTENDANCE_SETTINGS':
        return <AttendanceManager session={currentSession} onUpdateSession={setCurrentSession} />;
      case 'STUDENT_CHECKIN':
        return currentUser ? <StudentCheckIn user={currentUser} session={currentSession} /> : null;
      case 'HISTORY':
        return currentUser ? <History currentUser={currentUser} /> : null;
      case 'USER_MANAGEMENT':
        return <UserManagement />;
      case 'RANDOM_CHECK':
        return <RandomCall />;
      default:
        return <div>Unknown View</div>;
    }
  };

  if (!currentUser || currentView === 'LOGIN') {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        user={currentUser} 
        currentView={currentView} 
        onNavigate={setCurrentView}
        onLogout={handleLogout}
      />
      <main className="flex-1 md:ml-72 ml-0 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto h-full">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
