import { Users, MessageSquare, ExternalLink, Briefcase, X, TrendingUp, Plus } from 'lucide-react';
import { Prospect } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';

interface DashboardProps {
  prospects: Prospect[];
  onOpenAdd: () => void;
}

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: number; icon: React.ElementType; accent?: string }) {
  return (
    <div className="bg-card p-3.5 rounded-xl border border-border shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className={`p-2 rounded-lg ${accent || 'bg-primary/10'}`}>
          <Icon size={16} className="text-primary" />
        </div>
        <div>
          <div className="text-lg font-bold tracking-tight text-foreground tabular-nums leading-none">{value}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">{label}</div>
        </div>
      </div>
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
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-foreground">{t('dashboard.title')}</h1>
        <button
          onClick={onOpenAdd}
          className="bg-primary hover:opacity-90 text-primary-foreground text-sm font-semibold w-10 h-10 rounded-full flex items-center justify-center transition-opacity shadow-lg shadow-primary/25"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Stats grid - 2x2 + 1 */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label={t('dashboard.totalProspects')} value={stats.total} icon={Users} />
        <StatCard label={t('dashboard.contacted')} value={stats.contacted} icon={MessageSquare} />
        <StatCard label={t('dashboard.demos')} value={stats.demos} icon={ExternalLink} />
        <StatCard label={t('dashboard.signed')} value={stats.signed} icon={Briefcase} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label={t('dashboard.refused')} value={stats.refused} icon={X} />
      </div>

      {/* Funnel */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-sm">
          <TrendingUp size={16} className="text-primary" /> {t('dashboard.funnel')}
        </h3>
        <div className="flex items-end gap-2 h-32">
          {funnelData.map((item, i) => {
            const pct = stats.total > 0 ? (item.val / stats.total) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full h-24 flex items-end">
                  <div
                    style={{ '--bar-height': `${Math.max(pct, 4)}%`, animationDelay: `${i * 0.1}s` } as React.CSSProperties}
                    className={`${item.className} rounded-t-lg w-full opacity-80 animate-grow-up`}
                  />
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold tabular-nums text-foreground">{item.val}</span>
                  <p className="text-[9px] font-bold uppercase text-muted-foreground leading-tight">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
        <h3 className="font-bold text-foreground mb-3 text-sm">{t('dashboard.recentActivity')}</h3>
        <div className="space-y-3">
          {prospects.slice(0, 5).map((p) => (
            <div key={p.id} className="flex gap-3 items-center cursor-pointer active:bg-muted rounded-lg p-2 -mx-2 transition-colors" onClick={() => navigate('/prospects')}>
              <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground truncate">{p.activities[0]?.text}</p>
              </div>
            </div>
          ))}
          {prospects.length === 0 && (
            <div className="text-center py-6">
              <Users size={28} className="text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{t('dashboard.noActivity')}</p>
              <button onClick={onOpenAdd} className="text-sm text-primary font-semibold mt-2 active:opacity-70">{t('dashboard.addProspect')}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
