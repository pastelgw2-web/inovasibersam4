
import React, { useState } from 'react';
import { InnovationChallenge, User, UserRole, SiteSettings } from '../types';

interface CollaborationHubProps {
  challenges: InnovationChallenge[];
  user: User | null;
  settings: SiteSettings;
  onLoginRedirect?: () => void;
  onRoleUpdate?: (newRole: UserRole) => void;
}

const CollaborationHub: React.FC<CollaborationHubProps> = ({ challenges, user, settings, onLoginRedirect, onRoleUpdate }) => {
  const [showProposalModal, setShowProposalModal] = useState<string | null>(null);
  const [showPortalForm, setShowPortalForm] = useState(false);
  const [proposalText, setProposalText] = useState('');

  // Use dynamic content from settings
  const headline = settings.collaborationContent?.headline || "Collaborator Guidance Hub.";
  const subheadline = settings.collaborationContent?.subheadline || "Pemimpin industri dan lembaga riset memberdayakan inovator melalui integrasi teknis dan akses pasar.";
  const guidanceItems = settings.collaborationContent?.guidanceItems || [];
  const slaPartner = settings.collaborationContent?.slaItems || [];

  const handleCreatePortal = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Portal dukungan baru Anda telah dikirim untuk kurasi admin. Kami akan menghubungi Anda dalam 24 jam.");
    setShowPortalForm(false);
  };

  const handleProposeClick = (challengeId: string) => {
    if (!user) {
      if (onLoginRedirect) onLoginRedirect();
      return;
    }
    setShowProposalModal(challengeId);
  };

  const isCollaborator = user?.role === UserRole.COLLABORATOR || user?.role === UserRole.ADMIN;

  return (
    <div className="animate-in fade-in duration-700 pb-24">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 pt-10">
        <div>
          <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Industrial Integration Hub</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2 leading-none">
            {headline.includes(".") ? (
              <>
                {headline.split(".")[0]} <span className="text-emerald-600">.</span>
              </>
            ) : (
              headline
            )}
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl leading-relaxed text-left">
            {subheadline}
          </p>
        </div>
        
        {isCollaborator ? (
          <button 
            onClick={() => setShowPortalForm(!showPortalForm)}
            className={`px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active-tap shadow-xl ${
              showPortalForm ? 'bg-slate-100 text-slate-500' : 'bg-slate-900 text-white shadow-slate-200'
            }`}
          >
            {showPortalForm ? 'Cancel New Portal' : 'Open New Support Portal'}
          </button>
        ) : (
          <button 
            onClick={() => {
              const element = document.getElementById('become-partner');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs active-tap shadow-xl"
          >
            Become a Partner
          </button>
        )}
      </div>

      {/* NEW PORTAL FORM (Protected) */}
      {showPortalForm && isCollaborator && (
        <div className="mb-16 animate-in slide-in-from-top-4 duration-500">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border-2 border-emerald-500/20 shadow-2xl shadow-emerald-500/5">
            <h2 className="text-2xl font-black text-slate-900 mb-8 text-left">Create New Support Program</h2>
            <form onSubmit={handleCreatePortal} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Program Title</label>
                  <input type="text" required placeholder="e.g. Akses Lab IoT & Mentoring Startup" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/5 font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Integration Focus (Separated by comma)</label>
                  <input type="text" required placeholder="IoT, Renewable Energy, Materials" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/5 font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Benefit Offered</label>
                  <input type="text" required placeholder="e.g. Free Lab Access & Industrial Pilot" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/5 font-bold text-emerald-600" />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Detailed Support Description</label>
                  <textarea rows={8} required placeholder="Jelaskan infrastruktur atau keahlian apa yang Anda sediakan untuk para inovator..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/5 font-medium leading-relaxed"></textarea>
                </div>
              </div>
              <div className="md:col-span-2 pt-6">
                <button type="submit" className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 uppercase tracking-widest text-xs active-tap">
                  Launch Support Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PUBLIC CHALLENGES LIST */}
      <div className="space-y-10 mb-24 text-left">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Active Industrial Portals</h2>
          <div className="h-px flex-1 bg-slate-100"></div>
        </div>
        <div className="grid grid-cols-1 gap-8">
          {challenges.map(challenge => (
            <div key={challenge.id} className="group bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col lg:flex-row gap-10 items-center">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-emerald-600 text-2xl border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    {challenge.companyName.slice(0, 1)}
                  </div>
                  <div>
                    <h3 className="font-black text-2xl text-slate-900 leading-none mb-2">{challenge.title}</h3>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{challenge.companyName} • Official Partner</p>
                  </div>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">{challenge.description}</p>
                <div className="flex flex-wrap gap-2">
                  {challenge.skillsNeeded.map(s => (
                    <span key={s} className="px-4 py-2 bg-slate-50 text-slate-500 text-[10px] font-black uppercase rounded-xl border border-slate-100">{s}</span>
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-80 bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Collaborator Offer</span>
                <h4 className="text-slate-900 font-black text-xl mb-8 leading-snug">{challenge.reward}</h4>
                <button 
                  onClick={() => handleProposeClick(challenge.id)}
                  className="w-full py-4 bg-white border-2 border-emerald-500 text-emerald-600 font-black rounded-xl hover:bg-emerald-500 hover:text-white transition-all active-tap uppercase tracking-widest text-[10px]"
                >
                  Propose Integration
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BECOME A PARTNER (Guidance & SLA) */}
      <section id="become-partner" className="pt-20 border-t border-slate-100 text-left">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">Partner With Us</h2>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
            Pelajari peran dan standar layanan (SLA) sebagai mitra industri di platform Inovasi Bersama.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {guidanceItems.map((item, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group text-left">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-xl font-black text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white mb-20 relative overflow-hidden shadow-2xl shadow-slate-900/10 text-left">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-10 flex items-center gap-3">
              <span className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-sm">✓</span>
              Service Level Agreement (SLA) Guarantee
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {slaPartner.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="text-emerald-500 font-black text-2xl">{item.time}</p>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ONBOARDING CTA */}
        {!isCollaborator && (
          <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] p-12 border border-slate-100 text-center shadow-2xl shadow-slate-200/50">
            <h2 className="text-2xl font-black text-slate-900 mb-4">Mulai Peran Anda Sebagai Catalyst?</h2>
            <p className="text-slate-500 font-medium mb-10">Daftarkan perusahaan Anda sebagai Collaborator untuk membuka akses infrastruktur ke inovator pilihan.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <button 
                  onClick={() => onRoleUpdate?.(UserRole.COLLABORATOR)}
                  className="px-10 py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 active-tap uppercase tracking-widest text-xs"
                >
                  Upgrade to Collaborator
                </button>
              ) : (
                <button 
                  onClick={onLoginRedirect}
                  className="px-10 py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 active-tap uppercase tracking-widest text-xs"
                >
                  Join as Partner
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* PROPOSAL MODAL */}
      {showProposalModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl text-left">
            <div className="p-8 bg-emerald-600 text-white flex justify-between items-center">
              <h3 className="text-2xl font-black">Propose Integration</h3>
              <button onClick={() => setShowProposalModal(null)} className="opacity-50 hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-slate-500 text-sm font-medium">Anda sedang mengajukan inovasi Anda untuk diintegrasikan dengan sistem milik partner industri ini.</p>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Message to Partner</label>
                <textarea 
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  placeholder="Jelaskan secara singkat bagaimana inovasi Anda dapat diintegrasikan..."
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/5 font-medium min-h-[150px]"
                />
              </div>
              <button 
                onClick={() => { alert("Proposal kolaborasi Anda telah terkirim! Mitra industri akan meninjau dalam waktu 72 jam."); setShowProposalModal(null); setProposalText(''); }}
                className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 active-tap uppercase tracking-widest text-xs"
              >
                Submit Proposal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborationHub;
