
import React from 'react';
import { Announcement, ProjectCategory, Project, SiteSettings, ProjectStatus } from '../types';
import { MOCK_ANNOUNCEMENTS } from '../constants';

interface StoryPortalProps {
  story?: Announcement | null;
  settings: SiteSettings;
  projects: Project[];
  onBack: () => void;
  onStartInnovation: () => void;
}

const StoryPortal: React.FC<StoryPortalProps> = ({ story, settings, projects, onBack, onStartInnovation }) => {
  if (story) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
        <div className="relative h-[50vh] min-h-[400px] w-full">
          <img src={story.imageUrl} alt={story.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FD] via-slate-900/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
            <div className="max-w-4xl mx-auto">
              <button onClick={onBack} className="mb-8 flex items-center gap-3 text-white/90 hover:text-white font-black text-xs uppercase tracking-widest transition-all group">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                </div>
                Kembali ke News & Impact
              </button>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6">{story.title}</h1>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-8 py-16">
          <div className="prose prose-xl prose-slate max-w-none text-left">
            <p className="text-2xl font-medium text-slate-600 leading-relaxed mb-10 border-l-4 border-emerald-500 pl-8">{story.content}</p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard calculations
  const totalHimpun = projects.reduce((sum, p) => sum + p.currentFunding, 0);
  const totalHimpunInBillions = (totalHimpun / 1000000000).toFixed(2);
  const totalDonors = settings.impact.totalDonorsOverride || projects.reduce((sum, p) => sum + p.donorsCount, 0);
  const totalInnovators = settings.impact.totalInnovatorsOverride || projects.length;
  const totalPartners = settings.impact.totalPartnersOverride || 10;
  const efficiency = settings.impact.efficiency || 88;

  const categoryStats = Object.values(ProjectCategory).map(cat => {
    const catProjects = projects.filter(p => p.category === cat);
    const catDonors = catProjects.reduce((sum, p) => sum + p.donorsCount, 0);
    const catInnovators = catProjects.length;
    const catCollaborators = Math.ceil(catProjects.length * 0.4);
    const catHimpun = catProjects.reduce((sum, p) => sum + p.currentFunding, 0);
    const catTarget = catProjects.reduce((sum, p) => sum + p.targetFunding, 0) || 1;
    const catProgress = Math.round((catHimpun / catTarget) * 100);

    const iconMap: any = {
      [ProjectCategory.TECHNOLOGY]: '🚀',
      [ProjectCategory.SOCIAL]: '🤝',
      [ProjectCategory.ENVIRONMENT]: '🌱',
      [ProjectCategory.EDUCATION]: '🎓',
      [ProjectCategory.HEALTH]: '🏥',
    };

    return {
      name: cat,
      icon: iconMap[cat],
      donors: catDonors,
      innovators: catInnovators,
      kollab: catCollaborators,
      himpun: (catHimpun / 1000000).toFixed(1) + 'Jt',
      target: (catTarget / 1000000).toFixed(1) + 'Jt',
      progress: catProgress,
      color: cat === ProjectCategory.TECHNOLOGY ? 'text-blue-500' : 
             cat === ProjectCategory.SOCIAL ? 'text-amber-500' :
             cat === ProjectCategory.ENVIRONMENT ? 'text-emerald-500' :
             cat === ProjectCategory.EDUCATION ? 'text-purple-500' : 'text-rose-500'
    };
  });

  return (
    <div className="animate-in fade-in duration-700">
      {/* INFOGRAPHIC DASHBOARD SECTION */}
      <div className="mb-20 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Total Capital Flow Card */}
          <div className="lg:col-span-5 bg-[#0F172A] rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full"></div>
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-6">Total Capital Flow</p>
              <div className="flex items-center gap-6 mb-10">
                <div className="flex flex-col">
                  <h2 className="text-6xl font-black tracking-tighter">Rp {totalHimpunInBillions}B <span className="text-sm font-bold text-slate-400 align-middle">Himpun</span></h2>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center animate-spin-slow">
                   <div className="w-10 h-10 bg-emerald-500/20 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex gap-10">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Disalurkan</p>
                  <p className="text-xl font-black">Rp {totalHimpunInBillions}B</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Efisiensi</p>
                  <p className="text-xl font-black text-emerald-400">{efficiency}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Global Ecosystem Card */}
          <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10">Our Global Ecosystem</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center border-r border-slate-100">
                <p className="text-4xl font-black text-slate-900 mb-2">{totalDonors}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Donors</p>
              </div>
              <div className="text-center border-r border-slate-100">
                <p className="text-4xl font-black text-emerald-600 mb-2">{totalInnovators}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Innovators</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-slate-900 mb-2">{totalPartners}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Partners</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categoryStats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all text-left">
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-8">
                <div className="text-center">
                  <p className="text-sm font-black text-slate-900">{stat.donors}</p>
                  <p className="text-[7px] font-black text-slate-400 uppercase">Donors</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-emerald-600">{stat.innovators}</p>
                  <p className="text-[7px] font-black text-slate-400 uppercase">Inovator</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-slate-900">{stat.kollab}</p>
                  <p className="text-[7px] font-black text-slate-400 uppercase">Kollab</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                   <p className="text-[8px] font-black text-slate-400 uppercase">Funds: {stat.progress}% Disbursed</p>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                   <div className={`h-full bg-emerald-500 rounded-full`} style={{ width: `${stat.progress}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-[9px] font-black">
                   <span className="text-slate-400">Rp {stat.himpun}</span>
                   <span className="text-emerald-500">Rp {stat.target}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mb-12 pt-6">
        <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Innovation Pulse</span>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-none">{settings.impact.headline}</h1>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">{settings.impact.subheadline}</p>
      </div>

      {/* FILTER BUTTONS & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
          {['ALL', 'IMPACT', 'TECHNOLOGY', 'COLLABORATION', 'COMMUNITY'].map(f => (
            <button key={f} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${f === 'ALL' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="w-full md:w-64 relative group">
          <input type="text" placeholder="Search stories..." className="w-full px-10 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all text-xs font-bold" />
          <svg className="w-4 h-4 absolute left-4 top-3 text-slate-300 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {MOCK_ANNOUNCEMENTS.map((item) => (
          <div key={item.id} className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2 text-left">
            <div className="relative h-64 overflow-hidden">
              <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
              <div className="absolute top-4 left-4">
                 <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[8px] font-black uppercase tracking-widest rounded-lg shadow-sm">Featured</span>
              </div>
            </div>
            <div className="p-10 flex-1 flex flex-col">
              <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors leading-tight">{item.title}</h3>
              <p className="text-sm text-slate-500 font-medium mb-8 line-clamp-3 leading-relaxed">{item.content}</p>
              <div className="mt-auto flex justify-between items-center">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">5 Min Read</span>
                 <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryPortal;
