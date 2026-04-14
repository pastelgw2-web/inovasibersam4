
import React from 'react';
import { ProjectCategory, Project, SiteSettings } from '../types';

interface GlobalImpactProps {
  settings: SiteSettings;
  projects: Project[];
}

const GlobalImpact: React.FC<GlobalImpactProps> = ({ settings, projects }) => {
  const totalRaised = projects.reduce((sum, p) => sum + p.currentFunding, 0);
  const totalInnovators = projects.length;
  const totalPartners = Math.ceil(projects.length * 0.4) + 2;

  const categoryImpacts = [
    { category: ProjectCategory.TECHNOLOGY, icon: '🚀', progress: 78, color: "bg-blue-600", lightColor: "bg-blue-50" },
    { category: ProjectCategory.EDUCATION, icon: '🎓', progress: 92, color: "bg-amber-500", lightColor: "bg-amber-50" },
    { category: ProjectCategory.HEALTH, icon: '🩺', progress: 64, color: "bg-rose-500", lightColor: "bg-rose-50" },
    { category: ProjectCategory.SOCIAL, icon: '🤝', progress: 85, color: "bg-purple-600", lightColor: "bg-purple-50" },
    { category: ProjectCategory.ENVIRONMENT, icon: '🌿', progress: 70, color: "bg-emerald-600", lightColor: "bg-emerald-50" }
  ];

  return (
    <div className="space-y-12 mb-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {settings.impact.showInnovatorsCount && (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Inovator Didukung</span>
            <p className="text-4xl font-black text-slate-900">{totalInnovators}+</p>
          </div>
        )}
        {settings.impact.showPartnersCount && (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Partner</span>
            <p className="text-4xl font-black text-emerald-600">{totalPartners}</p>
          </div>
        )}
        {settings.impact.showDonorsCount && (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Dana Tersalurkan</span>
            <p className="text-4xl font-black text-slate-900">Rp {(totalRaised / 1e6).toFixed(1)}Jt</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categoryImpacts.map((item, idx) => (
          <div key={idx} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col group relative overflow-hidden transition-all duration-500 hover:shadow-xl">
            <div className={`absolute top-0 right-0 w-24 h-24 ${item.lightColor} blur-[50px] opacity-40 -mr-10 -mt-10 rounded-full`}></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className={`w-14 h-14 ${item.lightColor} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner`}>{item.icon}</div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">{item.category}</h3>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">PROGRES TARGET</span>
                  <span className="text-xs font-black text-slate-900">{item.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalImpact;
