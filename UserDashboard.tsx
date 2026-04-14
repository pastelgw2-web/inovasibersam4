
import React, { useState, useRef } from 'react';
import { ProjectCategory, User, SiteSettings } from '../types';

interface InnovateProps {
  user: User | null;
  settings: SiteSettings;
  onSubmit: (project: any) => void;
  onLoginRedirect: () => void;
}

const Innovate: React.FC<InnovateProps> = ({ user, settings, onSubmit, onLoginRedirect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    category: ProjectCategory.TECHNOLOGY,
    fundingGoal: 50000000,
    problemStatement: '',
    technicalSolution: '',
    impactMetrics: '',
    milestones: '',
    videoUrl: '',
    imageUrl: '',
    proposalUrl: '', 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadedFileName(file.name);
      setTimeout(() => {
        const fakeUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, proposalUrl: fakeUrl }));
        setIsUploading(false);
      }, 1500);
    }
  };

  const guidanceSteps = [
    { step: "01", title: "Problem Definition", desc: "Jelaskan gap atau masalah spesifik yang Anda selesaikan dengan data pendukung.", icon: "🎯" },
    { step: "02", title: "Technical Validation", desc: "Paparkan metodologi, arsitektur, atau bukti ilmiah solusi Anda (Whitepaper/Blueprints).", icon: "🔬" },
    { step: "03", title: "Scale & Impact", desc: "Definisikan bagaimana proyek ini akan tumbuh dan memberikan dampak sosial nyata.", icon: "📈" }
  ];

  const slaItems = settings.innovationSla || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      innovatorId: user?.id,
      createdAt: new Date().toISOString()
    });
    alert("Proposal Inovasi Anda berhasil dikirim untuk proses kurasi teknis. Mohon cek email secara berkala.");
  };

  const HeaderSection = () => (
    <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
      <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Innovation Lab</span>
      <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-none">Elevate Your <span className="text-emerald-600">Research.</span></h1>
      <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
        Standar pengajuan proposal yang komprehensif untuk memastikan kepercayaan penuh dari investor institusi dan donor publik.
      </p>
    </div>
  );

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <HeaderSection />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-left">
          {guidanceSteps.map((s, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-slate-50 font-black text-6xl group-hover:text-emerald-50/50 transition-colors">{s.step}</div>
              <div className="relative z-10">
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="text-lg font-black text-slate-900 mb-3">{s.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white mb-20 relative overflow-hidden text-left shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-12 tracking-tight">Curation & Launch <span className="text-emerald-500">SLA</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {slaItems.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-emerald-500 font-black text-2xl mb-1">{item.time}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{item.label}</span>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-emerald-600 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Mulai Revolusi Anda</h2>
          <button onClick={onLoginRedirect} className="px-10 py-5 bg-white text-emerald-600 font-black rounded-2xl shadow-xl uppercase tracking-widest text-xs active-tap">Sign In to Continue</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <HeaderSection />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        <div className="lg:col-span-8 space-y-12">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-sm">1</span>
                Project Identity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Project Title</label>
                  <input name="title" value={formData.title} onChange={handleChange} required type="text" placeholder="e.g. Robot Pembersih Terumbu Karang Otonom" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-emerald-500/5 outline-none font-bold" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Catchy Tagline</label>
                  <input name="tagline" value={formData.tagline} onChange={handleChange} required type="text" placeholder="Satu kalimat yang merangkum nilai inovasi Anda." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-emerald-500/5 outline-none font-medium" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Primary Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-700">
                    {Object.values(ProjectCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Funding Goal (IDR)</label>
                  <input name="fundingGoal" value={formData.fundingGoal} onChange={handleChange} required type="number" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-sm">2</span>
                Research & Technical Core
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Problem Statement</label>
                  <textarea name="problemStatement" value={formData.problemStatement} onChange={handleChange} required rows={4} placeholder="Jelaskan masalah..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-medium"></textarea>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Technical Solution</label>
                  <textarea name="technicalSolution" value={formData.technicalSolution} onChange={handleChange} required rows={6} placeholder="Cara kerja teknis..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-medium"></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-sm">3</span>
                Media & Verification
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">PITCH VIDEO LINK (YOUTUBE)</label>
                  <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} type="url" placeholder="https://youtube.com/watch?v=..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">FEATURED IMAGE URL</label>
                  <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} required type="url" placeholder="https://..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] block mb-2">PROPOSAL DOCUMENT (PDF/DOCX FOR AI ANALYSIS)</label>
                  <div className="bg-emerald-50/50 border-2 border-dashed border-emerald-100 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center group transition-all hover:bg-emerald-50">
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx" />
                    {!formData.proposalUrl && !isUploading ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-emerald-500 group-hover:scale-110 transition-transform">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        </div>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-10 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all active-tap shadow-lg">Upload Document</button>
                      </div>
                    ) : isUploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Uploading {uploadedFileName}...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg text-white">
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{uploadedFileName}</p>
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1 hover:underline">Ganti Dokumen</button>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-[9px] text-emerald-500 mt-4 font-black uppercase tracking-widest flex items-center justify-center gap-1">
                    <span className="text-xs">✨</span> Dokumen ini akan di-scan oleh AI untuk evaluasi teknis mendalam pada menu kurasi.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">DEVELOPMENT MILESTONES</label>
                  <textarea name="milestones" value={formData.milestones} onChange={handleChange} required rows={4} placeholder="Fase 1: Prototype, Fase 2: Beta..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-medium"></textarea>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="flex-1 py-6 bg-emerald-600 text-white font-black rounded-2xl shadow-2xl active-tap uppercase tracking-widest text-xs">Submit Professional Proposal</button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white">
              <h3 className="text-xl font-black mb-6">Curation Standards</h3>
              <ul className="space-y-6">
                 {guidanceSteps.map((s, idx) => (
                   <li key={idx} className="flex gap-4">
                     <span className="text-emerald-500 font-black text-sm">{s.step}</span>
                     <div>
                       <p className="font-black text-sm leading-none mb-1">{s.title}</p>
                       <p className="text-slate-400 text-xs font-medium leading-relaxed">{s.desc}</p>
                     </div>
                   </li>
                 ))}
              </ul>
           </div>

           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
             <h3 className="text-xl font-black text-slate-900 tracking-tight">Innovation <span className="text-emerald-600">SLA</span></h3>
             <div className="space-y-6">
               {slaItems.map((item, idx) => (
                 <div key={idx} className="space-y-1">
                   <p className="text-emerald-600 font-black text-sm">{item.time}</p>
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{item.label}</p>
                   <p className="text-slate-400 text-[10px] leading-relaxed font-medium">{item.desc}</p>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Innovate;
