
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Navigation from './components/Navigation';
import ProjectCard from './components/ProjectCard';
import NewsSlider from './components/NewsSlider';
import GlobalImpact from './components/GlobalImpact';
import ProjectDetail from './pages/ProjectDetail';
import AdminCMS from './pages/AdminCMS';
import Auth from './pages/Auth';
import CollaborationHub from './pages/CollaborationHub';
import Innovate from './pages/Innovate';
import UserDashboard from './pages/UserDashboard';
import StoryPortal from './pages/StoryPortal';
import { Project, User, UserRole, ProjectCategory, ProjectStatus, Donation, SiteSettings, VolunteerApplication, Announcement, Disbursement } from './types';
import { MOCK_PROJECTS, MOCK_USERS, MOCK_ANNOUNCEMENTS, MOCK_CHALLENGES } from './constants';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-24 md:pb-12 animate-in fade-in duration-500">
    {children}
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as UserRole,
            avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`,
            isVerified: profile.is_verified,
            kycStatus: profile.kyc_status as VerificationStatus
          });
        }
      }
      setIsAuthReady(true);
    };

    checkUser();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as UserRole,
            avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`,
            isVerified: profile.is_verified,
            kycStatus: profile.kyc_status as VerificationStatus
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    handleNavigate('home');
  };
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [disbursements, setDisbursements] = useState<Disbursement[]>([]);
  const [volunteerApps, setVolunteerApps] = useState<VolunteerApplication[]>([
    {
      id: 'va1',
      projectId: 'p1',
      userId: 'u5',
      userName: 'Siti Aminah',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=siti',
      skillName: 'Computer Vision',
      pitch: 'Saya ahli dalam pengolahan citra medis.',
      status: 'Pending',
      timestamp: new Date().toISOString()
    }
  ]);

  const [settings, setSettings] = useState<SiteSettings>({
    platformName: 'Inovasi Bersama',
    primaryColor: '#10b981', 
    logoUrl: '',
    reportLink: 'https://inovasibersama.id/report',
    impact: {
      headline: 'News & Impact Stories.',
      subheadline: 'Kisah sukses dan laporan transparansi ekosistem Inovasi Bersama.',
      globalFundTarget: 1500000000,
      showDonorsCount: true,
      showInnovatorsCount: true,
      showPartnersCount: true,
      efficiency: 88,
      totalDonorsOverride: 711,
      totalInnovatorsOverride: 15,
      totalPartnersOverride: 10
    },
    innovationSla: [
      { id: 'sla1', label: "Curation Screening", time: "24-48 Working Hours", desc: "Tim ahli kami akan melakukan verifikasi awal terhadap kelayakan proposal Anda." },
      { id: 'sla2', label: "Technical Review", time: "5-7 Working Days", desc: "Review mendalam oleh mitra industri atau akademisi terkait validitas solusi teknis." },
      { id: 'sla3', label: "Public Launch", time: "Instant after Approval", desc: "Proyek langsung tayang dan dapat menerima dukungan dana serta relawan ahli." }
    ],
    collaborationContent: {
      headline: "Collaborator Guidance Hub.",
      subheadline: "Pemimpin industri dan lembaga riset memberdayakan inovator melalui integrasi teknis dan akses pasar.",
      guidanceItems: [
        { id: 'g1', title: "Technical Mentorship", desc: "Membimbing inovator dalam standarisasi produk agar layak masuk ke rantai pasok industri.", icon: "⚙️" },
        { id: 'g2', title: "Resource Integration", desc: "Menyediakan akses ke laboratorium, data teknis, atau komponen khusus untuk percepatan prototipe.", icon: "🏢" },
        { id: 'g3', title: "Market Access", desc: "Menjadi 'First Buyer' atau mitra distribusi bagi inovasi yang telah lulus uji validasi industri.", icon: "🌎" }
      ],
      slaItems: [
        { id: 'csla1', label: "Response Time", time: "Max 72 Hours", desc: "Komitmen membalas proposal integrasi dari inovator." },
        { id: 'csla2', label: "IP Protection", time: "NDA Guaranteed", desc: "Perlindungan hukum penuh atas kekayaan intelektual inovator." },
        { id: 'csla3', label: "Quarterly Review", time: "Milestone Sync", desc: "Sinkronisasi progres berkala setiap kuartal." }
      ]
    }
  });

  const [currentView, setView] = useState<string>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleNavigate = (view: string) => {
    setSelectedProjectId(null);
    setSelectedStoryId(null);
    setView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProject = (id: string) => {
    setSelectedProjectId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStory = (id: string) => {
    setSelectedStoryId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGlobalBack = () => {
    if (selectedProjectId || selectedStoryId) {
      setSelectedProjectId(null);
      setSelectedStoryId(null);
    } else if (currentView !== 'home') {
      setView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--primary-hover', settings.primaryColor + 'EE');
    document.title = `${settings.platformName} - Super App`;
  }, [settings]);

  const handleDonation = (projectId: string, amount: number, isRecurring: boolean) => {
    const newDonation: Donation = {
      id: `d-${Date.now()}`,
      projectId,
      amount,
      donorName: user?.name || 'Public Donor',
      isRecurring,
      timestamp: new Date().toISOString()
    };
    setDonations([...donations, newDonation]);
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, currentFunding: p.currentFunding + amount, donorsCount: p.donorsCount + 1 } : p
    ));
    alert(`Dukungan Rp ${amount.toLocaleString()} berhasil disalurkan.`);
  };

  const handleDisburse = (disbursement: Disbursement) => {
    setDisbursements([disbursement, ...disbursements]);
  };

  const handleUpdateVolunteerStatus = (appId: string, status: 'Approved' | 'Rejected') => {
    setVolunteerApps(apps => apps.map(a => a.id === appId ? { ...a, status } : a));
  };

  const handleInnovationSubmit = (formData: any) => {
    const newProject: Project = {
      ...formData,
      id: `p-${Date.now()}`,
      status: ProjectStatus.PENDING,
      currentFunding: 0,
      donorsCount: 0,
      volunteersCount: 0,
      requirements: [
        { id: 'r1', name: 'Lead Developer', totalSlots: 1, filledSlots: 0 },
        { id: 'r2', name: 'UI Designer', totalSlots: 1, filledSlots: 0 }
      ]
    };
    setProjects([newProject, ...projects]);
    handleNavigate('dashboard');
  };

  const renderContent = () => {
    if (selectedProjectId) {
      const p = projects.find(proj => proj.id === selectedProjectId);
      return p ? (
        <PageWrapper>
          <ProjectDetail 
            project={p} user={user} 
            onBack={() => setSelectedProjectId(null)} 
            onDonation={(amount, isRecurring) => handleDonation(p.id, amount, isRecurring)} 
            onVolunteer={(sid, pitch) => {
              const newApp: VolunteerApplication = {
                id: `va-${Date.now()}`,
                projectId: p.id,
                userId: user?.id || 'anon',
                userName: user?.name || 'Anonymous',
                userAvatar: user?.avatar || '',
                skillName: p.requirements.find(r => r.id === sid)?.name || 'General',
                pitch,
                status: 'Pending',
                timestamp: new Date().toISOString()
              };
              setVolunteerApps([...volunteerApps, newApp]);
              alert('Aplikasi terkirim!');
            }}
          />
        </PageWrapper>
      ) : null;
    }

    if (selectedStoryId || currentView === 'news') {
      const news = selectedStoryId ? announcements.find(n => n.id === selectedStoryId) : null;
      return (
        <PageWrapper>
          <StoryPortal story={news} settings={settings} projects={projects} onBack={handleGlobalBack} onStartInnovation={() => handleNavigate('innovate')} />
        </PageWrapper>
      );
    }

    switch(currentView) {
      case 'dashboard':
        return user ? (
          <PageWrapper>
            <UserDashboard user={user} projects={projects} donations={donations} volunteerApps={volunteerApps} onViewProject={handleOpenProject} />
          </PageWrapper>
        ) : (
          <PageWrapper><Auth mode="login" onAuthSuccess={(u) => { setUser(u); setView('dashboard'); }} onSwitchMode={setView} /></PageWrapper>
        );
      case 'admin':
        return (
          <AdminCMS 
            projects={projects} users={users} donations={donations} disbursements={disbursements} volunteerApps={volunteerApps} announcements={announcements} settings={settings} 
            onUpdateProject={(id, s) => setProjects(projects.map(p => p.id === id ? {...p, status: s} : p))} 
            onUpdateUser={(id, updates) => setUsers(users.map(u => u.id === id ? {...u, ...updates} : u))} 
            onUpdateVolunteerApp={handleUpdateVolunteerStatus} 
            onSaveBranding={setSettings} onUpdateAnnouncements={setAnnouncements}
            onDisburse={handleDisburse} onDeleteNews={(id) => setAnnouncements(announcements.filter(a => a.id !== id))}
          />
        );
      case 'innovate':
        return <PageWrapper><Innovate user={user} settings={settings} onSubmit={handleInnovationSubmit} onLoginRedirect={() => setView('login')} /></PageWrapper>;
      case 'corporate':
        return <PageWrapper><CollaborationHub challenges={MOCK_CHALLENGES} user={user} settings={settings} onLoginRedirect={() => setView('login')} onRoleUpdate={(r) => user && setUser({...user, role: r})} /></PageWrapper>;
      case 'login':
      case 'register':
        return <PageWrapper><Auth mode={currentView as any} onAuthSuccess={(u) => { setUser(u); setView('dashboard'); }} onSwitchMode={setView} /></PageWrapper>;
      default:
        return (
          <PageWrapper>
            <NewsSlider announcements={announcements.filter(a => a.active)} onStartInnovation={() => handleNavigate('innovate')} onViewStory={handleOpenStory} />
            <GlobalImpact settings={settings} projects={projects} />

            <div className="flex flex-col space-y-10 mb-16 text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Inovasi Terkurasi</h2>
                  <p className="text-slate-500 text-sm font-medium">Bantu wujudkan solusi nyata bagi Indonesia.</p>
                </div>
                <div className="flex gap-3">
                   <button onClick={() => handleNavigate('innovate')} className="px-6 py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl active-tap shadow-lg shadow-emerald-500/10 transition-transform">START PROJECT</button>
                   <button onClick={() => handleNavigate('corporate')} className="px-6 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl active-tap shadow-lg shadow-slate-900/10 transition-transform">COLLABORATE</button>
                </div>
              </div>
              <div className="w-full relative group">
                <input type="text" placeholder="Cari inovasi..." className="w-full px-8 py-5 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold text-slate-700 shadow-sm" onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {projects.filter(p => p.status === ProjectStatus.ACTIVE).filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map(p => <ProjectCard key={p.id} project={p} onClick={() => handleOpenProject(p.id)} />)}
            </div>
          </PageWrapper>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] selection:bg-emerald-500 selection:text-white relative text-left">
      <Navigation user={user} currentView={currentView} settings={settings} setView={handleNavigate} onLogout={handleLogout} />
      {renderContent()}
    </div>
  );
};

export default App;
