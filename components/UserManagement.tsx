
import React, { useState } from 'react';
import { getUsers, saveUser, deleteUser } from '../services/mockData';
import { User, Role } from '../types';
import { Trash2, Plus, ShieldCheck, GraduationCap, Search, Users } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(getUsers());
  const [activeTab, setActiveTab] = useState<Role>(Role.STUDENT);
  const [newUser, setNewUser] = useState({ name: '', loginId: '', role: Role.STUDENT });
  const [searchTerm, setSearchTerm] = useState('');

  // Sync new user role with active tab
  const handleTabChange = (role: Role) => {
    setActiveTab(role);
    setNewUser(prev => ({ ...prev, role: role }));
    setSearchTerm('');
  };

  const filteredUsers = users
    .filter(u => u.role === activeTab)
    .filter(u => u.name.includes(searchTerm) || u.loginId.includes(searchTerm));

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.loginId) return;

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUser.name,
      loginId: newUser.loginId,
      role: newUser.role
    };

    saveUser(user);
    setUsers(getUsers());
    setNewUser({ ...newUser, name: '', loginId: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除该用户吗?')) {
      deleteUser(id);
      setUsers(getUsers());
    }
  };

  const idLabel = activeTab === Role.TEACHER ? '工号' : '学号';
  
  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-fade-in pb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
            <div className="p-3 md:p-4 rounded-2xl shadow-sm bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <Users size={24} className="md:w-8 md:h-8" />
            </div>
            <div>
                <h2 className="text-xl md:text-3xl font-bold text-slate-800">用户管理</h2>
                <p className="text-slate-500 text-xs md:text-sm mt-0.5 md:mt-1">管理系统内的教师与学生名单</p>
            </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-white p-1 rounded-xl border border-slate-200 flex shadow-sm">
          <button
            onClick={() => handleTabChange(Role.STUDENT)}
            className={`flex items-center space-x-2 px-4 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === Role.STUDENT
                ? 'bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-200'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <GraduationCap size={16} />
            <span>学生列表</span>
          </button>
          <button
            onClick={() => handleTabChange(Role.TEACHER)}
            className={`flex items-center space-x-2 px-4 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === Role.TEACHER
                ? 'bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-200'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck size={16} />
            <span>教师列表</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Add New Form */}
        <div className="lg:col-span-1">
            <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-6">
                <div className={`h-1.5 w-12 rounded-full mb-4 ${activeTab === Role.TEACHER ? 'bg-indigo-500' : 'bg-blue-500'}`}></div>
                <h3 className="font-bold text-slate-800 mb-5 flex items-center text-lg">
                    添加新{activeTab === Role.TEACHER ? '教师' : '学生'}
                </h3>
                <form onSubmit={handleAddUser} className="space-y-4 md:space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">姓名</label>
                        <input
                            value={newUser.name}
                            onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400"
                            placeholder="请输入姓名"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{idLabel}</label>
                        <input
                            value={newUser.loginId}
                            onChange={e => setNewUser({ ...newUser, loginId: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400"
                            placeholder={`请输入${idLabel}`}
                        />
                    </div>
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={!newUser.name || !newUser.loginId}
                            className={`w-full py-3.5 text-white rounded-xl text-sm font-bold shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0 ${activeTab === Role.TEACHER ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'}`}
                        >
                            <Plus size={18} />
                            <span>确认添加</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-4 border-b border-slate-100 flex items-center space-x-3 bg-slate-50/50 backdrop-blur">
                   <div className="bg-white p-2 rounded-lg border border-slate-200 text-slate-400">
                        <Search size={18} />
                   </div>
                   <input 
                      type="text" 
                      placeholder={`搜索${activeTab === Role.TEACHER ? '教师' : '学生'}...`} 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="bg-transparent outline-none flex-1 text-sm text-slate-700 placeholder-slate-400 font-medium"
                   />
                   <div className="text-xs font-bold text-slate-400 px-2 md:px-3 whitespace-nowrap">
                       {filteredUsers.length} 人
                   </div>
                </div>
                
                <div className="flex-1 bg-slate-50/30 p-2 md:p-0">
                     {filteredUsers.length === 0 ? (
                         <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 space-y-2 min-h-[300px]">
                             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                 <Search size={24} className="opacity-30" />
                             </div>
                             <p className="text-sm">没有找到匹配的用户</p>
                         </div>
                     ) : (
                        <>
                            {/* Desktop View: Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-white text-slate-400 text-[10px] font-bold uppercase tracking-wider sticky top-0 z-10">
                                        <tr>
                                            <th className="p-4 pl-6">基本信息</th>
                                            <th className="p-4">{idLabel}</th>
                                            <th className="p-4 text-right pr-6">管理</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-slate-50/80 group transition-colors">
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border ${
                                                        user.role === Role.TEACHER 
                                                        ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                                                        : 'bg-blue-50 text-blue-600 border-blue-100'
                                                    }`}>
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-slate-700">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-500 font-mono text-sm font-medium">{user.loginId}</td>
                                            <td className="p-4 text-right pr-6">
                                                <button 
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    title="删除用户"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View: Cards */}
                            <div className="md:hidden space-y-3 p-1">
                                {filteredUsers.map(user => (
                                    <div key={user.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base shadow-sm border ${
                                                user.role === Role.TEACHER 
                                                ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                                                : 'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{user.name}</h4>
                                                <p className="text-xs text-slate-500 font-mono">{idLabel}: {user.loginId}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2.5 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                     )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
