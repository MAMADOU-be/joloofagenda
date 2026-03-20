import { LayoutDashboard, Users, Briefcase, CalendarDays, Settings, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';

interface AppSidebarProps {
  signedCount: number;
  monthlyGoal: number;
  collapsed: boolean;
  onToggle: () => void;
  onSignOut?: () => void;
  userEmail?: string;
}

export function AppSidebar({ signedCount, monthlyGoal, onSignOut, userEmail }: AppSidebarProps) {
  const { t } = useI18n();
  const progress = monthlyGoal > 0 ? Math.min((signedCount / monthlyGoal) * 100, 100) : 0;

  const NAV_ITEMS = [
    { to: '/', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/prospects', icon: Users, label: t('nav.prospects') },
    { to: '/clients', icon: Briefcase, label: t('nav.clients') },
    { to: '/rendez-vous', icon: CalendarDays, label: 'RDV' },
    { to: '/parametres', icon: Settings, label: t('nav.settings') },
  ];

  return (
    <>
      {/* Top header bar */}
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-card/95 backdrop-blur-md border-b border-border flex items-center justify-between px-4 safe-area-top">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
            A
          </div>
          <span className="font-bold text-foreground text-base">L'Artisan</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Goal progress pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-muted rounded-full border border-border">
            <div className="w-12 h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-[10px] font-bold text-muted-foreground tabular-nums">{signedCount}/{monthlyGoal}</span>
          </div>
          {onSignOut && (
            <button onClick={onSignOut} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Déconnexion">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </header>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border safe-area-bottom">
        <div className="flex items-stretch justify-around h-16 max-w-lg mx-auto">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-primary/10' : ''}`}>
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-[10px] font-semibold ${isActive ? 'text-primary' : ''}`}>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
