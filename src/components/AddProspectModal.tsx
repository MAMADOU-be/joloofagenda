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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="bg-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-modal-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-foreground">{t('modal.title')}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>
        <form
          className="p-6 space-y-4"
          onSubmit={e => {
            e.preventDefault();
            onAdd(form);
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">{t('modal.name')}</label>
              <input required value={form.name} onChange={e => set('name', e.target.value)} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">{t('modal.sector')}</label>
              <select value={form.sector} onChange={e => set('sector', e.target.value)} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground outline-none">
                {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">{t('modal.source')}</label>
              <select value={form.source} onChange={e => set('source', e.target.value)} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground outline-none">
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">{t('modal.address')}</label>
              <input value={form.address} onChange={e => set('address', e.target.value)} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">{t('modal.city')}</label>
              <input required value={form.city} onChange={e => set('city', e.target.value)} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">{t('modal.phone')}</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">{t('modal.googleRating')}</label>
              <input value={form.rating} onChange={e => set('rating', e.target.value)} placeholder="4.5" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">{t('modal.reviewCount')}</label>
              <input value={form.reviewCount} onChange={e => set('reviewCount', e.target.value)} placeholder="42" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">{t('modal.notes')}</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground outline-none resize-none" />
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
            {t('modal.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
