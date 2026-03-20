import { LayoutDashboard, Users, Briefcase, Settings, CalendarDays, LogOut, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useState, useEffect } from 'react';

interface AppSidebarProps {
  signedCount: number;
  monthlyGoal: number;
  collapsed: boolean;
  onToggle: () => void;
  onSignOut?: () => void;
  userEmail?: string;
}

export function AppSidebar({ signedCount, monthlyGoal, collapsed, onToggle, onSignOut, userEmail }: AppSidebarProps) {
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const progress = monthlyGoal > 0 ? Math.min((signedCount / monthlyGoal) * 100, 100) : 0;

  // Close mobile sidebar on route change
  useEffect(() => {
    const handler = () => setMobileOpen(false);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const NAV_ITEMS = [
    { to: '/', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/prospects', icon: Users, label: t('nav.prospects') },
    { to: '/clients', icon: Briefcase, label: t('nav.clients') },
    { to: '/rendez-vous', icon: CalendarDays, label: t('nav.appointments') },
    { to: '/parametres', icon: Settings, label: t('nav.settings') },
  ];

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-4 h-14 md:h-16 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
            A
          </div>
          {(!collapsed || mobileOpen) && <span className="font-bold tracking-tight text-lg text-foreground">L'Artisan</span>}
        </div>
        {/* Close button on mobile */}
        <button onClick={() => setMobileOpen(false)} className="md:hidden p-1 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
        {/* Collapse button on desktop */}
        <button onClick={onToggle} className="hidden md:block p-1 text-muted-foreground hover:text-foreground">
          <Menu size={18} />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`
            }
          >
            <item.icon size={18} className="shrink-0" />
            {(!collapsed || mobileOpen) && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {(!collapsed || mobileOpen) && (
        <div className="m-3 p-4 bg-muted rounded-xl border border-border">
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">{t('sidebar.monthlyGoal')}</p>
          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs mt-2 font-medium text-foreground">{signedCount} / {monthlyGoal} {t('sidebar.signatures')}</p>
        </div>
      )}

      <div className="border-t border-border p-3">
        {(!collapsed || mobileOpen) && userEmail && (
          <p className="text-xs text-muted-foreground truncate mb-2 px-1">{userEmail}</p>
        )}
        {onSignOut && (
          <button onClick={onSignOut} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full">
            <LogOut size={18} className="shrink-0" />
            {(!collapsed || mobileOpen) && <span>Déconnexion</span>}
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-card border-b border-border flex items-center px-4 gap-3">
        <button onClick={() => setMobileOpen(true)} className="p-1.5 text-foreground">
          <Menu size={22} />
        </button>
        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xs">A</div>
        <span className="font-bold text-foreground">L'Artisan</span>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] bg-card flex flex-col shadow-xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={`hidden md:flex ${collapsed ? 'w-16' : 'w-64'} border-r border-border bg-card flex-col transition-all duration-300 shrink-0`}>
        {sidebarContent}
      </aside>
    </>
  );
}
