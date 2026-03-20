import { Calendar, Globe, Briefcase } from 'lucide-react';
import { Prospect } from '@/lib/types';
import { useI18n } from '@/lib/i18n';

interface ClientsProps {
  clients: Prospect[];
}

export default function Clients({ clients }: ClientsProps) {
  const { t, locale } = useI18n();
  const totalRevenue = clients.reduce((sum, c) => sum + (parseFloat(c.proposedPrice) || 0), 0);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-foreground">{t('clients.title')}</h1>

      <div className="bg-primary p-5 rounded-2xl text-primary-foreground shadow-lg shadow-primary/20">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold uppercase opacity-70 tracking-widest">{t('clients.totalRevenue')}</p>
            <h2 className="text-3xl font-black mt-1 tabular-nums">{totalRevenue.toLocaleString(locale)} €</h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase opacity-70 tracking-widest">{t('clients.signedContracts')}</p>
            <h2 className="text-3xl font-black mt-1 tabular-nums">{clients.length}</h2>
          </div>
        </div>
      </div>

      {clients.length > 0 ? (
        <div className="space-y-3">
          {clients.map(client => (
            <div key={client.id} className="bg-card p-4 rounded-xl border border-border shadow-sm">
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-foreground text-sm">{client.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Calendar size={11} /> {t('clients.signedOn')} {client.signedDate ? new Date(client.signedDate).toLocaleDateString(locale) : '—'}
                  </p>
                  {client.websiteUrl && (
                    <a href={client.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-semibold mt-1 flex items-center gap-1 active:opacity-70">
                      <Globe size={11} /> {t('clients.viewSite')}
                    </a>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-primary tabular-nums">{parseFloat(client.proposedPrice) ? `${parseFloat(client.proposedPrice).toLocaleString(locale)} €` : '—'}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{client.sector}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-dashed border-border py-16 text-center">
          <div className="inline-flex p-3 bg-muted rounded-full mb-3">
            <Briefcase size={28} className="text-muted-foreground/40" />
          </div>
          <h3 className="text-foreground font-semibold text-sm">{t('clients.empty')}</h3>
          <p className="text-muted-foreground text-xs mt-1">{t('clients.emptyDesc')}</p>
        </div>
      )}
    </div>
  );
}
