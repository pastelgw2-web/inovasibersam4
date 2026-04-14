
import React, { useState, useEffect, useRef } from 'react';
import { Project, ProjectStatus, User, Donation, SiteSettings, VolunteerApplication, Announcement, Disbursement, ProjectCategory, VerificationStatus, UserRole, SlaItem, GuidanceItem } from '../types';
import { geminiService } from '../services/geminiService';

interface AdminCMSProps {
  projects: Project[];
  users: User[];
  donations: Donation[];
  disbursements: Disbursement[];
  volunteerApps: VolunteerApplication[];
  announcements: Announcement[];
  settings: SiteSettings;
  onUpdateProject: (id: string, status: ProjectStatus) => void;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
  onUpdateVolunteerApp: (id: string, status: 'Approved' | 'Rejected') => void;
  onSaveBranding: (settings: SiteSettings) => void;
  onUpdateAnnouncements: (news: Announcement[]) => void;
  onDisburse: (disbursement: Disbursement) => void;
  onDeleteNews: (id: string) => void;
}

const AdminCMS: React.FC<AdminCMSProps> = ({ 
  projects, users, donations, disbursements, volunteerApps, announcements, settings, 
  onUpdateProject, onUpdateUser, onUpdateVolunteerApp, onSaveBranding, onUpdateAnnouncements, onDisburse, onDeleteNews
}) => {
  const [activeTab, setActiveTab] = useState('ringkasan');
  const [brandForm, setBrandForm] = useState<SiteSettings>(settings);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<Announcement | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, { loading: boolean, result?: any }>>({});

  const [disburseAmount, setDisburseAmount] = useState<number>(0);
  const [selectedDisburseProject, setSelectedDisburseProject] = useState<string>('');
  const [showDisburseModal, setShowDisburseModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBrandForm(settings);
  }, [settings]);

  const handleAiAnalyze = async (project: Project) => {
    setAiAnalysis(prev => ({ ...prev, [project.id]: { loading: true } }));
    const descriptionContext = project.proposalUrl 
      ? `${project.description}\n\n[DOKUMEN LAMPIRAN TERSEDIA DI: ${project.proposalUrl}]` 
      : project.description;
    
    const result = await geminiService.analyzeInnovation(project.title, descriptionContext);
    setAiAnalysis(prev => ({ ...prev, [project.id]: { loading: false, result } }));
  };

  const handleCreateDisbursement = () => {
    if (!selectedDisburseProject || disburseAmount <= 0) {
      alert("Pilih proyek dan masukkan nominal yang valid.");
      return;
    }
    
    const targetProject = projects.find(p => p.id === selectedDisburseProject);
    if (targetProject && disburseAmount > targetProject.currentFunding) {
      alert("Jumlah pencairan melebihi dana yang tersedia di proyek.");
      return;
    }

    const newDisburse: Disbursement = {
      id: `dis-${Date.now()}`,
      projectId: selectedDisburseProject,
      amount: disburseAmount,
      status: 'Completed',
      timestamp: new Date().toISOString(),
      referenceCode: `REF-${Math.random().toString(36).toUpperCase().substr(2, 6)}`
    };
    onDisburse(newDisburse);
    alert("Pencairan dana berhasil diproses.");
    setDisburseAmount(0);
    setSelectedDisburseProject('');
    setShowDisburseModal(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBrandForm({ ...brandForm, logoUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSaveNews = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newsData: Announcement = {
      id: editingNews?.id || `n-${Date.now()}`,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      imageUrl: formData.get('imageUrl') as string,
      link: '#',
      active: true,
    };
    if (editingNews) {
      onUpdateAnnouncements(announcements.map(a => a.id === editingNews.id ? newsData : a));
    } else {
      onUpdateAnnouncements([newsData, ...announcements]);
    }
    setShowNewsModal(false);
    setEditingNews(null);
  };

  const handleUpdateImpactSettings = (updates: any) => {
    onSaveBranding({
      ...settings,
      impact: {
        ...settings.impact,
        ...updates
      }
    });
  };

  const handleUpdateSla = (id: string, updates: Partial<SlaItem>) => {
    const updatedSla = (settings.innovationSla || []).map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    onSaveBranding({ ...settings, innovationSla: updatedSla });
  };

  const handleUpdateCollabMainContent = (updates: { headline?: string, subheadline?: string }) => {
    onSaveBranding({ 
      ...settings, 
      collaborationContent: { 
        ...settings.collaborationContent!, 
        ...updates 
      } 
    });
  };

  const handleUpdateCollabSla = (id: string, updates: Partial<SlaItem>) => {
    const updatedSla = (settings.collaborationContent?.slaItems || []).map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    onSaveBranding({ 
      ...settings, 
      collaborationContent: { 
        ...settings.collaborationContent!, 
        slaItems: updatedSla 
      } 
    });
  };

  const handleUpdateCollabGuidance = (id: string, updates: Partial<GuidanceItem>) => {
    const updatedGuidance = (settings.collaborationContent?.guidanceItems || []).map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    onSaveBranding({ 
      ...settings, 
      collaborationContent: { 
        ...settings.collaborationContent!, 
        guidanceItems: updatedGuidance 
      } 
    });
  };

  const getGradeColor = (grade: string) => {
    const g = grade?.toUpperCase();
    if (g?.includes('GRADE A')) return 'bg-emerald-500 text-white shadow-emerald-500/20';
    if (g?.includes('GRADE B')) return 'bg-amber-500 text-white shadow-amber-500/20';
    if (g?.includes('GRADE C')) return 'bg-red-500 text-white shadow-red-500/20';
    return 'bg-slate-200 text-slate-500';
  };

  const menuItems = [
    { id: 'ringkasan', label: 'Ringkasan', icon: '📊' },
    { id: 'kurasi', label: 'Kurasi', icon: '💎', badge: projects.filter(p => p.status === ProjectStatus.PENDING).length },
    { id: 'news', label: 'News & Impact', icon: '📰' },
    { id: 'talenta', label: 'Talenta', icon: '🤝', badge: volunteerApps.filter(v => v.status === 'Pending').length },
    { id: 'keuangan', label: 'Keuangan', icon: '💰' },
    { id: 'pengguna', label: 'Pengguna', icon: '👥' },
    { id: 'branding', label: 'Branding', icon: '⚙️' },
    { id: 'content_inovasi', label: '(Edit Content Inovasi)', icon: '💡' },
    { id: 'content_kolaborasi', label: '(Edit Kolaborasi)', icon: '🤝' },
  ];

  const PageHeader = ({ title, desc, action }: { title: string, desc: string, action?: React.ReactNode }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 text-left">
      <div className="space-y-1">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">{title}</h1>
        <p className="text-slate-500 font-medium text-base max-w-2xl">{desc}</p>
      </div>
      <div className="flex gap-3">{action}</div>
    </div>
  );

  // Financial Dashboard Calculations
  const totalInflow = donations.reduce((sum, d) => sum + d.amount, 0);
  const feeYield = Math.floor(totalInflow * 0.05); // Assume 5% fee
  const totalOutflow = disbursements.reduce((sum, d) => sum + d.amount, 0);
  const netReserve = totalInflow - totalOutflow;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-16 md:pt-20">
      <div className="sticky top-16 md:top-20 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-2 py-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 flex items-center gap-2 ${
                activeTab === item.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
              {item.badge ? <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">{item.badge}</span> : null}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 pb-32 text-left">
        {activeTab === 'ringkasan' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <PageHeader title="Pusat Komando" desc="Analisis performa real-time ekosistem Inovasi Bersama." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Total Inflow', value: `Rp ${totalInflow.toLocaleString()}`, color: 'text-emerald-600', icon: '💰' },
                { label: 'Proyek Aktif', value: projects.filter(p => p.status === ProjectStatus.ACTIVE).length, color: 'text-blue-600', icon: '🚀' },
                { label: 'Pending Kurasi', value: projects.filter(p => p.status === ProjectStatus.PENDING).length, color: 'text-amber-500', icon: '💎' },
                { label: 'Verified Talent', value: users.filter(u => u.kycStatus === VerificationStatus.VERIFIED).length, color: 'text-purple-600', icon: '🤝' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-left">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
                    <span className="text-xl">{stat.icon}</span>
                  </div>
                  <p className={`text-4xl font-black mb-2 ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'kurasi' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader title="Meja Kurasi AI" desc="Validasi teknis proposal menggunakan informasi komprehensif dari inovator dan asisten AI." />
            <div className="space-y-10 text-left">
              {projects.filter(p => p.status === ProjectStatus.PENDING).map(p => (
                <div key={p.id} className="bg-white rounded-[3rem] md:rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden p-6 md:p-14 transition-all hover:shadow-2xl">
                  <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
                    <div className="w-full lg:w-80 space-y-6 shrink-0 text-left">
                      <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-lg border-4 border-white">
                        <img src={p.imageUrl} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-6 bg-slate-50 rounded-[2rem] space-y-4">
                         <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Pendanaan</p>
                           <p className="font-black text-emerald-600 text-lg">Rp {p.targetFunding?.toLocaleString()}</p>
                         </div>
                         <div className="pt-4 space-y-2">
                           {p.proposalUrl && (
                             <a href={p.proposalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-all">
                               📄 Lihat Dokumen Proposal
                             </a>
                           )}
                         </div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-8 w-full text-left">
                      <div className="pb-6 border-b border-slate-50">
                        <h3 className="text-3xl font-black text-slate-900 mb-2 leading-tight">{p.title}</h3>
                        <p className="text-slate-500 font-medium italic text-lg">"{p.tagline}"</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Problem Statement</p>
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-h-[100px]">
                            <p className="text-sm text-slate-600 leading-relaxed">{p.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 pt-6 border-t border-slate-50">
                        <button onClick={() => onUpdateProject(p.id, ProjectStatus.ACTIVE)} className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase shadow-xl active-tap">Terima & Terbitkan</button>
                        <button onClick={() => onUpdateProject(p.id, ProjectStatus.REJECTED)} className="px-10 py-5 bg-red-50 text-red-600 rounded-2xl text-[11px] font-black uppercase border border-red-100 active-tap">Tolak</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FINANCIAL DASHBOARD TAB */}
        {activeTab === 'keuangan' && (
          <div className="space-y-12 animate-in fade-in duration-700 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
               <div>
                 <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">Modul Keuangan</h1>
                 <p className="text-slate-500 font-medium text-base mt-2">Pelacakan fidelitas tinggi untuk arus modal masuk dan pencairan proyek.</p>
               </div>
               <div className="flex items-center gap-3">
                 <button className="px-6 py-4 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl shadow-sm text-[10px] uppercase tracking-widest active-tap">EKSPOR CSV</button>
                 <button 
                  onClick={() => setShowDisburseModal(true)}
                  className="px-6 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 text-[10px] uppercase tracking-widest active-tap"
                 >
                   OTORISASI PEMBAYARAN
                 </button>
               </div>
            </div>

            {/* FINANCE STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* PLATFORM INFLOW */}
              <div className="bg-[#0F172A] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[240px]">
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-4">PLATFORM INFLOW</p>
                  <h2 className="text-5xl font-black tracking-tight mb-8">Rp {totalInflow.toLocaleString()}</h2>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-center text-[10px] font-black tracking-widest">
                   <span className="text-slate-500 uppercase">FEE YIELD (5%)</span>
                   <span className="text-white">RP {feeYield.toLocaleString()}</span>
                </div>
              </div>

              {/* CADANGAN BERSIH PROYEK */}
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[240px]">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">CADANGAN BERSIH PROYEK</p>
                  <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-8">Rp {netReserve.toLocaleString()}</h2>
                </div>
                <div className="pt-6 flex justify-between items-center text-[10px] font-black tracking-widest">
                   <span className="text-slate-400 uppercase">STATUS LIKUIDITAS</span>
                   <span className="text-emerald-500 uppercase">SEHAT</span>
                </div>
              </div>

              {/* TOTAL OUTFLOW */}
              <div className="bg-[#FFF1F2] p-10 rounded-[3rem] border border-rose-100 shadow-sm flex flex-col justify-between min-h-[240px]">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-4">TOTAL OUTFLOW</p>
                  <h2 className="text-5xl font-black tracking-tight text-rose-600 mb-8">Rp {totalOutflow.toLocaleString()}</h2>
                </div>
                <div className="pt-6 flex justify-between items-center text-[10px] font-black tracking-widest">
                   <span className="text-rose-300 uppercase">TOTAL PEMBAYARAN</span>
                   <span className="text-rose-600 uppercase">{disbursements.length} TX</span>
                </div>
              </div>
            </div>

            {/* TRANSACTION TABLES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* DONASI PUBLIK TERBARU */}
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-8 border-b border-slate-50">
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">DONASI PUBLIK TERBARU</h3>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">
                          <tr>
                             <th className="px-8 py-5">SUMBER</th>
                             <th className="px-8 py-5">MODAL</th>
                             <th className="px-8 py-5">WAKTU</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {donations.length > 0 ? donations.map(d => (
                             <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6">
                                   <div className="flex flex-col">
                                      <span className="font-black text-slate-900 text-xs">{d.donorName}</span>
                                      <span className="text-[9px] text-slate-400 font-bold uppercase">{projects.find(p => p.id === d.projectId)?.title}</span>
                                   </div>
                                </td>
                                <td className="px-8 py-6 font-black text-emerald-600 text-sm">Rp {d.amount.toLocaleString()}</td>
                                <td className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                   {new Date(d.timestamp).toLocaleDateString()}
                                </td>
                             </tr>
                          )) : (
                             <tr><td colSpan={3} className="px-8 py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">BELUM ADA DONASI MASUK</td></tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>

              {/* RIWAYAT PEMBAYARAN SISTEM */}
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-8 border-b border-slate-50">
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">RIWAYAT PEMBAYARAN SISTEM</h3>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">
                          <tr>
                             <th className="px-8 py-5">PROYEK TARGET</th>
                             <th className="px-8 py-5">MODAL</th>
                             <th className="px-8 py-5">STATUS</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {disbursements.length > 0 ? disbursements.map(dis => (
                             <tr key={dis.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6">
                                   <div className="flex flex-col">
                                      <span className="font-black text-slate-900 text-xs">{projects.find(p => p.id === dis.projectId)?.title}</span>
                                      <span className="text-[9px] text-slate-400 font-bold uppercase font-mono">{dis.referenceCode}</span>
                                   </div>
                                </td>
                                <td className="px-8 py-6 font-black text-rose-500 text-sm">Rp {dis.amount.toLocaleString()}</td>
                                <td className="px-8 py-6">
                                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded-lg uppercase tracking-widest">
                                      {dis.status}
                                   </span>
                                </td>
                             </tr>
                          )) : (
                             <tr><td colSpan={3} className="px-8 py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">BELUM ADA PENCAIRAN DANA</td></tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* ... TAB-TAB LAIN TETAP UTUH ... */}
        {activeTab === 'news' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <PageHeader title="Impact Newsroom" desc="Publikasikan kisah sukses dan kelola infografis dashboard dampak." action={<button onClick={() => { setEditingNews(null); setShowNewsModal(true); }} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/10">+ Tulis Kisah</button>} />
            
            <div className="bg-[#0F172A] p-10 rounded-[3rem] text-white space-y-10 shadow-2xl">
              <h3 className="text-xl font-black flex items-center gap-3">
                <span className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-sm">📊</span>
                Infographic Dashboard Manual Overrides
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Efficiency (%)</label>
                  <input type="number" value={settings.impact.efficiency} onChange={(e) => handleUpdateImpactSettings({ efficiency: Number(e.target.value) })} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none font-bold text-emerald-400" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Total Donors Override</label>
                  <input type="number" value={settings.impact.totalDonorsOverride} onChange={(e) => handleUpdateImpactSettings({ totalDonorsOverride: Number(e.target.value) })} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none font-bold text-white" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Total Innovators Override</label>
                  <input type="number" value={settings.impact.totalInnovatorsOverride} onChange={(e) => handleUpdateImpactSettings({ totalInnovatorsOverride: Number(e.target.value) })} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none font-bold text-white" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Total Partners Override</label>
                  <input type="number" value={settings.impact.totalPartnersOverride} onChange={(e) => handleUpdateImpactSettings({ totalPartnersOverride: Number(e.target.value) })} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none font-bold text-white" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {announcements.map(news => (
                 <div key={news.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col group hover:shadow-xl transition-all text-left">
                    <img src={news.imageUrl} className="w-full h-44 object-cover rounded-[1.5rem] mb-6" />
                    <h3 className="font-black text-slate-900 group-hover:text-emerald-600 transition-colors flex-1 text-lg mb-6">{news.title}</h3>
                    <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                       <button onClick={() => { setEditingNews(news); setShowNewsModal(true); }} className="text-[10px] font-black uppercase text-blue-600">Edit</button>
                       <button onClick={() => onDeleteNews(news.id)} className="text-[10px] font-black uppercase text-red-400">Hapus</button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'talenta' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader title="Pusat Talenta" desc="Review aplikasi relawan ahli untuk proyek aktif." />
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden text-left">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      <th className="px-8 py-6">Kandidat</th>
                      <th className="px-8 py-6">Expertise</th>
                      <th className="px-8 py-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {volunteerApps.map(app => (
                      <tr key={app.id}>
                        <td className="px-8 py-6 flex items-center gap-4">
                           <img src={app.userAvatar} className="w-10 h-10 rounded-full" />
                           <span className="font-black text-slate-900">{app.userName}</span>
                        </td>
                        <td className="px-8 py-6 font-bold text-indigo-600 text-xs">{app.skillName}</td>
                        <td className="px-8 py-6 text-right">
                           <button onClick={() => onUpdateVolunteerApp(app.id, 'Approved')} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase">Approve</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
        )}

        {activeTab === 'pengguna' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader title="Manajemen Pengguna" desc="Kelola profil, role, dan verifikasi anggota ekosistem." />
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden text-left">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      <th className="px-8 py-6">Pengguna</th>
                      <th className="px-8 py-6">Role</th>
                      <th className="px-8 py-6">Status KYC</th>
                      <th className="px-8 py-6 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id}>
                        <td className="px-8 py-6 flex items-center gap-4">
                           <img src={u.avatar} className="w-10 h-10 rounded-full border border-slate-100" />
                           <div>
                             <p className="font-black text-slate-900 text-sm leading-tight">{u.name}</p>
                             <p className="text-[10px] text-slate-400 font-bold">{u.email}</p>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-[10px] font-black uppercase text-indigo-600">{u.role}</span>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${u.kycStatus === VerificationStatus.VERIFIED ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                             {u.kycStatus}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button onClick={() => onUpdateUser(u.id, { kycStatus: VerificationStatus.VERIFIED })} className="text-[10px] font-black uppercase text-blue-600 hover:underline">Verifikasi</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
        )}

        {activeTab === 'branding' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <PageHeader title="Branding Portal" desc="Kelola identitas visual platform secara terpusat." />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">NAMA GLOBAL PLATFORM</label>
                  <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 shadow-inner">
                    <input type="text" value={brandForm.platformName} onChange={(e) => setBrandForm({...brandForm, platformName: e.target.value})} className="w-full bg-transparent outline-none font-black text-slate-900 text-xl" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">PLATFORM LOGO</label>
                  <div onClick={() => fileInputRef.current?.click()} className="bg-slate-50 p-10 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col md:flex-row items-center gap-8 group cursor-pointer hover:bg-slate-100 transition-all shadow-inner">
                    <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                    <div className="w-20 h-20 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-300 text-4xl shadow-sm group-hover:scale-105 transition-transform">+</div>
                    <div><p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">CLICK TO UPLOAD</p><p className="text-[9px] font-bold text-slate-400 uppercase">Square PNG/SVG, min 512x512px.</p></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">WARNA UTAMA SIGNATURE</label>
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-6 shadow-inner">
                    <input type="color" value={brandForm.primaryColor} onChange={(e) => setBrandForm({...brandForm, primaryColor: e.target.value})} className="w-16 h-16 rounded-xl border-none p-0 cursor-pointer overflow-hidden" />
                    <span className="font-black text-slate-900 text-xl font-mono uppercase tracking-tight">{brandForm.primaryColor}</span>
                  </div>
                </div>
                <button onClick={() => { onSaveBranding(brandForm); alert("🚀 Branding Baru di-deploy!"); }} className="w-full py-6 bg-[#0F172A] text-white font-black rounded-2xl shadow-2xl active-tap uppercase tracking-widest text-[11px] mt-10">DEPLOY BRANDING BARU</button>
              </div>
              <div className="lg:col-span-7">
                <div className="bg-emerald-50/20 border border-emerald-100 rounded-[3rem] p-12 h-full flex flex-col items-center justify-center text-center">
                  <div className="w-56 h-56 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center mb-10 border border-slate-50">
                    <div className="w-28 h-28 rounded-3xl flex items-center justify-center text-white italic font-black text-5xl" style={{ backgroundColor: brandForm.primaryColor }}>IB</div>
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">{brandForm.platformName}</h2>
                  <p className="text-slate-400 text-sm font-medium max-w-sm leading-relaxed text-center">Perubahan logo dan warna akan langsung diterapkan ke seluruh platform setelah di-deploy.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content_inovasi' && (
          <div className="space-y-12 animate-in fade-in duration-700 text-left">
            <PageHeader title="Edit Content Inovasi" desc="Kelola teks SLA yang muncul pada halaman pengajuan inovasi publik." />
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-12">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Service Level Agreement (SLA) Settings</h3>
              <div className="space-y-12">
                {(settings.innovationSla || []).map((item, idx) => (
                  <div key={item.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <div className="lg:col-span-1 flex items-center justify-center">
                       <span className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-black">{idx + 1}</span>
                    </div>
                    <div className="lg:col-span-11 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">SLA Title / Label</label>
                        <input type="text" value={item.label} onChange={(e) => handleUpdateSla(item.id, { label: e.target.value })} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-900" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Time Commitment</label>
                        <input type="text" value={item.time} onChange={(e) => handleUpdateSla(item.id, { time: e.target.value })} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none font-bold text-emerald-600" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Description</label>
                        <textarea rows={2} value={item.desc} onChange={(e) => handleUpdateSla(item.id, { desc: e.target.value })} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none font-medium text-slate-500 text-sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-6">
                <button onClick={() => alert("✅ Konten SLA Inovasi telah diperbarui.")} className="px-10 py-5 bg-[#0F172A] text-white font-black rounded-2xl shadow-xl active-tap uppercase tracking-widest text-[11px]">Simpan Perubahan SLA</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content_kolaborasi' && (
          <div className="space-y-12 animate-in fade-in duration-700 text-left">
            <PageHeader title="Edit Kolaborasi" desc="Kelola teks header, panduan peran, dan SLA yang muncul pada halaman kolaborasi publik." />
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Main Header Section</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Headline Title</label>
                  <input 
                    type="text" 
                    value={settings.collaborationContent?.headline} 
                    onChange={(e) => handleUpdateCollabMainContent({ headline: e.target.value })} 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-black text-2xl text-slate-900" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Sub-headline Description</label>
                  <textarea 
                    rows={3}
                    value={settings.collaborationContent?.subheadline} 
                    onChange={(e) => handleUpdateCollabMainContent({ subheadline: e.target.value })} 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-medium text-slate-500 text-base" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Guidance Cards (Role Sections)</h3>
              <div className="space-y-6">
                {(settings.collaborationContent?.guidanceItems || []).map((item, idx) => (
                  <div key={item.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-1 flex items-center justify-center">
                       <input 
                        type="text" 
                        value={item.icon} 
                        onChange={(e) => handleUpdateCollabGuidance(item.id, { icon: e.target.value })} 
                        className="w-12 h-12 bg-white border border-slate-200 rounded-xl text-center text-xl shadow-sm outline-none" 
                       />
                    </div>
                    <div className="md:col-span-11 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Card Title</label>
                        <input type="text" value={item.title} onChange={(e) => handleUpdateCollabGuidance(item.id, { title: e.target.value })} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-900" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Benefit / Explanation</label>
                        <textarea rows={2} value={item.desc} onChange={(e) => handleUpdateCollabGuidance(item.id, { desc: e.target.value })} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-500" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Collaboration SLA (Blue Section)</h3>
              <div className="grid grid-cols-1 gap-6">
                {(settings.collaborationContent?.slaItems || []).map((item) => (
                  <div key={item.id} className="p-8 bg-[#F1F5F9] rounded-[2rem] border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Large Value (e.g. Max 72 Hours)</label>
                      <input type="text" value={item.time} onChange={(e) => handleUpdateCollabSla(item.id, { time: e.target.value })} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none font-black text-emerald-600 text-lg" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Small Title Label</label>
                      <input type="text" value={item.label} onChange={(e) => handleUpdateCollabSla(item.id, { label: e.target.value })} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none font-black text-slate-900 uppercase tracking-widest text-[10px]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">SLA Policy Description</label>
                      <textarea rows={2} value={item.desc} onChange={(e) => handleUpdateCollabSla(item.id, { desc: e.target.value })} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none text-[11px] font-medium text-slate-500" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-6">
                <button onClick={() => alert("✅ Konten Kolaborasi telah diperbarui dan langsung tayang pada halaman publik.")} className="px-10 py-5 bg-[#0F172A] text-white font-black rounded-2xl shadow-xl active-tap uppercase tracking-widest text-[11px]">Deploy Perubahan Kolaborasi</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* DISBURSEMENT MODAL */}
      {showDisburseModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300 text-left">
           <div className="bg-white rounded-[4rem] w-full max-w-xl shadow-2xl p-14 animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black uppercase tracking-tight">Otorisasi Pembayaran</h3>
                <button onClick={() => setShowDisburseModal(false)} className="text-slate-300 hover:text-slate-900">✕</button>
             </div>
             <div className="space-y-6">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">PILIH PROYEK TARGET</label>
                   <select 
                    value={selectedDisburseProject}
                    onChange={(e) => setSelectedDisburseProject(e.target.value)}
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
                   >
                     <option value="">-- Pilih Proyek --</option>
                     {projects.filter(p => p.status === ProjectStatus.ACTIVE).map(p => (
                       <option key={p.id} value={p.id}>{p.title} (Sisa: Rp {p.currentFunding.toLocaleString()})</option>
                     ))}
                   </select>
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">NOMINAL PENCAIRAN (IDR)</label>
                   <input 
                    type="number"
                    value={disburseAmount}
                    onChange={(e) => setDisburseAmount(Number(e.target.value))}
                    placeholder="Masukkan nominal..."
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-black text-rose-500 text-xl" 
                   />
                </div>
                <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                   <p className="text-[10px] text-rose-600 font-bold leading-relaxed uppercase tracking-widest">PERINGATAN: Dana akan dikurangi dari saldo proyek secara permanen dan dicatat sebagai pengeluaran platform.</p>
                </div>
                <button 
                  onClick={handleCreateDisbursement}
                  className="w-full py-6 bg-emerald-600 text-white font-black rounded-[2rem] uppercase tracking-widest text-xs shadow-2xl active-tap"
                >
                  OTORISASI DAN TRANSFER
                </button>
             </div>
           </div>
        </div>
      )}

      {showNewsModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300 text-left">
           <div className="bg-white rounded-[4rem] w-full max-w-2xl shadow-2xl p-14 animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black uppercase tracking-tight">Impact Newsroom</h3>
                <button onClick={() => setShowNewsModal(false)} className="text-slate-300 hover:text-slate-900">✕</button>
             </div>
             <form onSubmit={handleSaveNews} className="space-y-6">
                <input name="title" defaultValue={editingNews?.title} required placeholder="Judul..." className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl outline-none font-black text-xl text-left" />
                <textarea name="content" defaultValue={editingNews?.content} required rows={5} placeholder="Konten..." className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl outline-none text-left"></textarea>
                <input name="imageUrl" defaultValue={editingNews?.imageUrl} required placeholder="URL Gambar..." className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl outline-none text-left" />
                <button type="submit" className="w-full py-6 bg-emerald-600 text-white font-black rounded-[2rem] uppercase tracking-widest text-xs shadow-2xl active-tap">Publikasikan</button>
             </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminCMS;
