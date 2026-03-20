import { Users, MessageSquare, ExternalLink, Briefcase, X, TrendingUp, Plus } from 'lucide-react';
import { Prospect } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';

interface DashboardProps {
  prospects: Prospect[];
  onOpenAdd: () => void;
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div className="bg-card p-4 md:p-5 rounded-xl border border-border shadow-sm">
      <div className="flex justify-between items-start mb-3 md:mb-4">
        <div className="p-1.5 md:p-2 bg-muted rounded-lg border border-border">
          <Icon size={18} className="text-primary" />
        </div>
      </div>
      <div className="text-xl md:text-2xl font-bold tracking-tight text-foreground tabular-nums">{value}</div>
      <div className="text-[10px] md:text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">{label}</div>
    </div>
  );
}

export default function Dashboard({ prospects, onOpenAdd }: DashboardProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const stats = {
    total: prospects.length,
    contacted: prospects.filter(p => p.status === 'CONTACTED').length,
    demos: prospects.filter(p => p.status === 'DEMO').length,
    signed: prospects.filter(p => p.status === 'SIGNED').length,
    refused: prospects.filter(p => p.status === 'REFUSED').length,
  };

  const funnelData = [
    { label: t('dashboard.funnelProspects'), val: stats.total, className: 'bg-status-prospect' },
    { label: t('dashboard.funnelContacted'), val: stats.contacted, className: 'bg-status-contacted' },
    { label: t('dashboard.funnelDemos'), val: stats.demos, className: 'bg-status-demo' },
    { label: t('dashboard.funnelSigned'), val: stats.signed, className: 'bg-status-signed' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">{t('dashboard.title')}</h1>
        <button
          onClick={onOpenAdd}
          className="bg-primary hover:opacity-90 text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-opacity shadow-sm"
        >
          <Plus size={16} /> {t('dashboard.add')}
          <kbd className="hidden md:inline-block ml-1 opacity-50 text-[10px] border border-primary-foreground/30 px-1 rounded">N</kbd>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label={t('dashboard.totalProspects')} value={stats.total} icon={Users} />
        <StatCard label={t('dashboard.contacted')} value={stats.contacted} icon={MessageSquare} />
        <StatCard label={t('dashboard.demos')} value={stats.demos} icon={ExternalLink} />
        <StatCard label={t('dashboard.signed')} value={stats.signed} icon={Briefcase} />
        <StatCard label={t('dashboard.refused')} value={stats.refused} icon={X} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="font-bold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" /> {t('dashboard.funnel')}
          </h3>
          <div className="flex items-end gap-3 h-48">
            {funnelData.map((item, i) => {
              const pct = stats.total > 0 ? (item.val / stats.total) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                    <div className="w-full h-48 flex items-end">
                      <div
                        style={{ '--bar-height': `${Math.max(pct, 2)}%`, animationDelay: `${i * 0.1}s` } as React.CSSProperties}
                        className={`${item.className} rounded-t-lg w-full opacity-80 hover:opacity-100 transition-opacity animate-grow-up`}
                      />
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-bold tabular-nums text-foreground">{item.val}</span>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="font-bold text-foreground mb-4">{t('dashboard.recentActivity')}</h3>
          <div className="space-y-4">
            {prospects.slice(0, 5).map((p) => (
              <div key={p.id} className="flex gap-3 items-start cursor-pointer hover:bg-muted rounded-lg p-2 -m-2 transition-colors" onClick={() => navigate('/prospects')}>
                <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.activities[0]?.text}</p>
                </div>
              </div>
            ))}
            {prospects.length === 0 && (
              <div className="text-center py-8">
                <Users size={32} className="text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">{t('dashboard.noActivity')}</p>
                <button onClick={onOpenAdd} className="text-sm text-primary font-semibold mt-2 hover:underline">{t('dashboard.addProspect')}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
