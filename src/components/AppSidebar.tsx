import { LayoutDashboard, Users, Briefcase, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';

interface AppSidebarProps {
  signedCount: number;
  monthlyGoal: number;
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ signedCount, monthlyGoal, collapsed, onToggle }: AppSidebarProps) {
  const { t } = useI18n();
  const progress = monthlyGoal > 0 ? Math.min((signedCount / monthlyGoal) * 100, 100) : 0;

  const NAV_ITEMS = [
    { to: '/', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/prospects', icon: Users, label: t('nav.prospects') },
    { to: '/clients', icon: Briefcase, label: t('nav.clients') },
    { to: '/parametres', icon: Settings, label: t('nav.settings') },
  ];

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} border-r border-border bg-card flex flex-col transition-all duration-300 shrink-0`}>
      <div className="flex items-center gap-2 px-4 h-16 border-b border-border">
        <button onClick={onToggle} className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
          A
        </button>
        {!collapsed && <span className="font-bold tracking-tight text-lg text-foreground">L'Artisan</span>}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`
            }
          >
            <item.icon size={18} className="shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <div className="m-3 p-4 bg-muted rounded-xl border border-border">
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">{t('sidebar.monthlyGoal')}</p>
          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs mt-2 font-medium text-foreground">{signedCount} / {monthlyGoal} {t('sidebar.signatures')}</p>
        </div>
      )}
    </aside>
  );
}
