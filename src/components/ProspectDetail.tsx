import { useState, useCallback } from 'react';
import { X, Phone, MapPin, Briefcase, Star, Link, Euro, Plus, ChevronDown, Sparkles, Loader2 } from 'lucide-react';
import { Prospect, ProspectStatus, STATUSES } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { useI18n } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';

interface ProspectDetailProps {
  prospect: Prospect;
  onClose: () => void;
  onUpdateStatus: (id: string, status: ProspectStatus) => void;
  onUpdateProspect: (id: string, updates: Partial<Prospect>) => void;
  onAddActivity: (id: string, text: string) => void;
}

export function ProspectDetail({ prospect, onClose, onUpdateStatus, onUpdateProspect, onAddActivity }: ProspectDetailProps) {
  const { t, locale } = useI18n();
  const [activityText, setActivityText] = useState('');
  const [demoLink, setDemoLink] = useState(prospect.demoLink);
  const [proposedPrice, setProposedPrice] = useState(prospect.proposedPrice);

  const handleAddActivity = () => {
    if (!activityText.trim()) return;
    onAddActivity(prospect.id, activityText);
    setActivityText('');
  };

  const handleSaveFields = () => {
    onUpdateProspect(prospect.id, { demoLink, proposedPrice });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-4 pt-3 pb-3 border-b border-border bg-card safe-area-top">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onClose} className="flex items-center gap-1 text-sm text-primary font-semibold active:opacity-70">
            <ChevronDown size={18} /> Fermer
          </button>
          <StatusBadge status={prospect.status} />
        </div>
        <h2 className="text-lg font-bold text-foreground">{prospect.name}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{prospect.sector} · {t('detail.addedOn')} {new Date(prospect.createdAt).toLocaleDateString(locale)}</p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Contact info */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Phone size={14} className="text-muted-foreground shrink-0" />
            <span className="font-medium">{prospect.phone || t('detail.notProvided')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPin size={14} className="text-muted-foreground shrink-0" />
            <span>{prospect.address ? `${prospect.address}, ` : ''}{prospect.city}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star size={14} className="text-amber-500 shrink-0" />
            <span className="font-bold text-foreground">{prospect.rating || '—'}</span>
            <span className="text-muted-foreground text-xs">({prospect.reviewCount || '0'} {t('detail.reviews')})</span>
          </div>
        </section>

        {prospect.notes && (
          <section>
            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">{t('detail.notes')}</p>
            <p className="text-sm text-foreground bg-muted p-3 rounded-xl">{prospect.notes}</p>
          </section>
        )}

        {/* Demo link + price */}
        <section className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1"><Link size={9} /> {t('detail.demoLink')}</label>
            <input value={demoLink} onChange={e => setDemoLink(e.target.value)} onBlur={handleSaveFields} placeholder="https://..." className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground outline-none mt-1" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1"><Euro size={9} /> {t('detail.proposedPrice')}</label>
            <input value={proposedPrice} onChange={e => setProposedPrice(e.target.value)} onBlur={handleSaveFields} placeholder="1500" className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground outline-none mt-1" />
          </div>
        </section>

        {/* Status */}
        <section>
          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">{t('detail.changeStatus')}</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(STATUSES) as ProspectStatus[]).map(key => (
              <button
                key={key}
                onClick={() => onUpdateStatus(prospect.id, key)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  prospect.status === key
                    ? 'bg-foreground text-card border-foreground shadow-md'
                    : 'bg-card text-muted-foreground border-border active:border-foreground/30'
                }`}
              >
                {t(`status.${key}` as any)}
              </button>
            ))}
          </div>
        </section>

        {/* Activities */}
        <section>
          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-3">{t('detail.activityHistory')}</p>
          <div className="flex gap-2 mb-4">
            <input
              value={activityText}
              onChange={e => setActivityText(e.target.value)}
              placeholder={t('detail.addActivity')}
              className="flex-1 px-3 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground outline-none"
              onKeyDown={e => e.key === 'Enter' && handleAddActivity()}
            />
            <button onClick={handleAddActivity} className="p-2.5 bg-primary text-primary-foreground rounded-xl active:opacity-90 transition-opacity">
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border">
            {prospect.activities.map(act => (
              <div key={act.id} className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-card border-2 border-primary" />
                <p className="text-sm text-foreground font-medium">{act.text}</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                  {new Date(act.date).toLocaleDateString(locale, { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom actions */}
      <div className="shrink-0 p-4 border-t border-border bg-card flex gap-3 safe-area-bottom">
        <a href={`tel:${prospect.phone}`} className="flex-1 py-3 px-4 bg-muted border border-border rounded-xl text-sm font-bold text-foreground active:bg-accent transition-colors flex items-center justify-center gap-2">
          <Phone size={16} /> {t('detail.callBtn')}
        </a>
        <button onClick={() => onUpdateStatus(prospect.id, 'SIGNED')} className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:opacity-90 transition-opacity">
          <Briefcase size={16} /> {t('detail.markClient')}
        </button>
      </div>
    </div>
  );
}
