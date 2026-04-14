
import React from 'react';
import { User, UserRole, SiteSettings } from '../types';

interface NavigationProps {
  user: User | null;
  currentView: string;
  settings: SiteSettings;
  setView: (view: string) => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, currentView, settings, setView, onLogout }) => {
  const mainMenus = [
    { id: 'home', label: 'Eksplor', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )},
    { id: 'innovate', label: 'Inovasi', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { id: 'corporate', label: 'Kolaborasi', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    )},
    { id: 'news', label: 'News & Impact', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    )},
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[110] bg-white/80 backdrop-blur-xl border-b border-slate-100 h-16 md:h-20 transition-all">
        <div className="max-w-7xl mx-auto h-full px-4 md:px-8 flex justify-between items-center">
          
          <div className="flex items-center gap-2.5 cursor-pointer group active-tap" onClick={() => setView('home')}>
            <div className="w-9 h-9 md:w-11 md:h-11 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              {settings.logoUrl ? <img src={settings.logoUrl} className="w-full h-full object-cover" /> : <span className="text-sm md:text-xl font-black italic">IB</span>}
            </div>
            <div className="flex flex-col">
              <span className="text-base md:text-xl font-black text-slate-900 leading-none">{settings.platformName}</span>
              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">Super App Inovasi</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {mainMenus.map((v) => (
              <button 
                key={v.id}
                onClick={() => setView(v.id)}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${currentView === v.id ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-900'}`}
              >
                {v.label}
                {currentView === v.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-full"></span>}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setView('dashboard')} className={`flex items-center gap-2 p-1 pr-3 rounded-full border transition-all active-tap ${currentView === 'dashboard' ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
                  <img src={user.avatar} className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white shadow-sm" />
                  <span className="text-[10px] md:text-xs font-black text-slate-700 hidden sm:block">{user.name.split(' ')[0]}</span>
                </button>
                {user.role === UserRole.ADMIN && (
                   <button onClick={() => setView('admin')} className={`p-2 transition-colors active-tap ${currentView === 'admin' ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-500'}`} title="Admin Panel">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                   </button>
                )}
                {/* Changed onLogout to onClick */}
                <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 active-tap">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button onClick={() => setView('login')} className="px-4 py-2.5 text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-600 hover:text-emerald-600 active-tap">Masuk</button>
                <button onClick={() => setView('register')} className="px-5 py-2.5 md:px-7 md:py-3.5 bg-emerald-600 text-white text-[10px] md:text-xs font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/20 active-tap">Daftar</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <nav className="fixed bottom-0 left-0 right-0 z-[110] lg:hidden bg-white border-t border-slate-100 h-16 px-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center h-full">
          {mainMenus.map(item => (
            <button 
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center gap-1 transition-all active-tap ${currentView === item.id ? 'text-emerald-600' : 'text-slate-400'}`}
            >
              {item.icon}
              <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
