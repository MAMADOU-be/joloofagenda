import { useState } from 'react';
import { X } from 'lucide-react';
import { Sector, Source, SECTORS, SOURCES } from '@/lib/types';
import { useI18n } from '@/lib/i18n';

interface AddProspectModalProps {
  onClose: () => void;
  onAdd: (data: {
    name: string;
    sector: Sector;
    address: string;
    city: string;
    phone: string;
    rating: string;
    reviewCount: string;
    notes: string;
    source: Source;
  }) => void;
}

export function AddProspectModal({ onClose, onAdd }: AddProspectModalProps) {
  const { t } = useI18n();
  const [form, setForm] = useState({
    name: '',
    sector: 'Médical' as Sector,
    address: '',
    city: '',
    phone: '',
    rating: '',
    reviewCount: '',
    notes: '',
    source: 'Google Maps' as Source,
  });

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/30" />
      <div
        className="relative bg-card rounded-t-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col z-10 safe-area-bottom"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        <div className="px-5 pb-2 flex justify-between items-center">
          <h2 className="text-base font-bold text-foreground">{t('modal.title')}</h2>
          <button onClick={onClose} className="p-1.5 rounded-full text-muted-foreground active:bg-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        <form
          className="px-5 pb-5 space-y-3 overflow-y-auto flex-1"
          onSubmit={e => {
            e.preventDefault();
            onAdd(form);
          }}
        >
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">{t('modal.name')} *</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)} className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">{t('modal.sector')}</label>
              <select value={form.sector} onChange={e => set('sector', e.target.value)} className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground outline-none">
                {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">{t('modal.source')}</label>
              <select value={form.source} onChange={e => set('source', e.target.value)} className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground outline-none">
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">{t('modal.address')}</label>
            <input value={form.address} onChange={e => set('address', e.target.value)} className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">{t('modal.city')} *</label>
              <input required value={form.city} onChange={e => set('city', e.target.value)} className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">{t('modal.phone')}</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">{t('modal.googleRating')}</label>
              <input value={form.rating} onChange={e => set('rating', e.target.value)} placeholder="4.5" className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">{t('modal.reviewCount')}</label>
              <input value={form.reviewCount} onChange={e => set('reviewCount', e.target.value)} placeholder="42" className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">{t('modal.notes')}</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground outline-none resize-none" />
          </div>
          <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-lg shadow-primary/20 active:opacity-90 transition-all mt-2">
            {t('modal.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
