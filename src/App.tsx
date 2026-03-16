import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { AppSidebar } from '@/components/AppSidebar';
import { AddProspectModal } from '@/components/AddProspectModal';
import { ProspectDetail } from '@/components/ProspectDetail';
import { useProspects } from '@/hooks/useProspects';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import Dashboard from '@/pages/Dashboard';
import Prospects from '@/pages/Prospects';
import Clients from '@/pages/Clients';
import Appointments from '@/pages/Appointments';
import SettingsPage from '@/pages/Settings';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import { Prospect } from '@/lib/types';
import { I18nProvider } from '@/lib/i18n';

function ProtectedApp() {
  const { user, loading, signOut } = useAuth();
  const { prospects, addProspect, updateProspect, updateStatus, addActivity, exportToCSV } = useProspects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('artisan_dark') === 'true');

  useEffect(() => {
    if (selectedProspect) {
      const updated = prospects.find(p => p.id === selectedProspect.id);
      if (updated) setSelectedProspect(updated);
    }
  }, [prospects, selectedProspect]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('artisan_dark', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'n' && !isModalOpen && !selectedProspect && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        setIsModalOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isModalOpen, selectedProspect]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-svh bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const signedCount = prospects.filter(p => p.status === 'SIGNED').length;
  const clients = prospects.filter(p => p.status === 'SIGNED');

  return (
    <>
      <div className="flex h-svh overflow-hidden">
        <AppSidebar
          signedCount={signedCount}
          monthlyGoal={6}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onSignOut={signOut}
          userEmail={user.email}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard prospects={prospects} onOpenAdd={() => setIsModalOpen(true)} />} />
              <Route path="/prospects" element={
                <Prospects prospects={prospects} onSelect={setSelectedProspect} onExport={exportToCSV} onOpenAdd={() => setIsModalOpen(true)} onUpdateStatus={updateStatus} />
              } />
              <Route path="/clients" element={<Clients clients={clients} />} />
              <Route path="/rendez-vous" element={<Appointments />} />
              <Route path="/parametres" element={<SettingsPage darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>

      {isModalOpen && <AddProspectModal onClose={() => setIsModalOpen(false)} onAdd={(data) => { addProspect(data); setIsModalOpen(false); }} />}
      {selectedProspect && (
        <ProspectDetail
          prospect={selectedProspect}
          onClose={() => setSelectedProspect(null)}
          onUpdateStatus={updateStatus}
          onUpdateProspect={updateProspect}
          onAddActivity={addActivity}
        />
      )}
    </>
  );
}

const App = () => {
  return (
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/auth" element={<AuthRoute />} />
            <Route path="/*" element={<ProtectedApp />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  );
};

function AuthRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-svh bg-background"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (user) return <Navigate to="/" replace />;
  return <Auth />;
}

export default App;
