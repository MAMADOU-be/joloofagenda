import { useState } from 'react';
import { X, Phone, MapPin, Briefcase, Star, Link, Euro, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Prospect, ProspectStatus, STATUSES } from '@/lib/types';
import { StatusBadge } from './StatusBadge';

interface ProspectDetailProps {
  prospect: Prospect;
  onClose: () => void;
  onUpdateStatus: (id: string, status: ProspectStatus) => void;
  onUpdateProspect: (id: string, updates: Partial<Prospect>) => void;
  onAddActivity: (id: string, text: string) => void;
}

export function ProspectDetail({ prospect, onClose, onUpdateStatus, onUpdateProspect, onAddActivity }: ProspectDetailProps) {
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
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/20 backdrop-blur-[2px]" onClick={onClose}>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-xl bg-card h-full shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div>
            <StatusBadge status={prospect.status} />
            <h2 className="text-2xl font-bold text-foreground mt-2">{prospect.name}</h2>
            <p className="text-xs text-muted-foreground mt-1">{prospect.sector} · Ajouté le {new Date(prospect.createdAt).toLocaleDateString('fr-FR')}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Contact info */}
          <section className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Coordonnées</p>
              <p className="text-sm font-medium text-foreground flex items-center gap-2"><Phone size={14} className="text-muted-foreground" /> {prospect.phone || 'Non renseigné'}</p>
              <p className="text-sm font-medium text-foreground flex items-center gap-2 mt-1"><MapPin size={14} className="text-muted-foreground" /> {prospect.address ? `${prospect.address}, ` : ''}{prospect.city}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Google Maps</p>
              <p className="text-sm font-bold flex items-center gap-1">
                <Star size={14} className="text-amber-500" />
                <span className="text-foreground">{prospect.rating || '—'}</span>
                <span className="text-muted-foreground font-normal">({prospect.reviewCount || '0'} avis)</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Source : {prospect.source}</p>
            </div>
          </section>

          {/* Notes */}
          {prospect.notes && (
            <section>
              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Notes</p>
              <p className="text-sm text-foreground bg-muted p-3 rounded-lg">{prospect.notes}</p>
            </section>
          )}

          {/* Demo link & price */}
          <section className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 flex items-center gap-1"><Link size={10} /> Lien démo Lovable</label>
              <input
                value={demoLink}
                onChange={e => setDemoLink(e.target.value)}
                onBlur={handleSaveFields}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground outline-none mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 flex items-center gap-1"><Euro size={10} /> Prix proposé</label>
              <input
                value={proposedPrice}
                onChange={e => setProposedPrice(e.target.value)}
                onBlur={handleSaveFields}
                placeholder="1500"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground outline-none mt-1"
              />
            </div>
          </section>

          {/* Status */}
          <section>
            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-3">Changer le statut</p>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(STATUSES) as [ProspectStatus, typeof STATUSES[ProspectStatus]][]).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => onUpdateStatus(prospect.id, key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    prospect.status === key
                      ? 'bg-foreground text-card border-foreground shadow-md'
                      : 'bg-card text-muted-foreground border-border hover:border-foreground/30'
                  }`}
                >
                  {val.label}
                </button>
              ))}
            </div>
          </section>

          {/* Activity timeline */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Historique d'activité</p>
            </div>
            <div className="flex gap-2 mb-4">
              <input
                value={activityText}
                onChange={e => setActivityText(e.target.value)}
                placeholder="Ajouter une activité..."
                className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground outline-none"
                onKeyDown={e => e.key === 'Enter' && handleAddActivity()}
              />
              <button
                onClick={handleAddActivity}
                className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border">
              {prospect.activities.map(act => (
                <div key={act.id} className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-card border-2 border-primary" />
                  <p className="text-sm text-foreground font-medium">{act.text}</p>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    {new Date(act.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="p-4 border-t border-border bg-muted flex gap-3">
          <a
            href={`tel:${prospect.phone}`}
            className="flex-1 py-3 px-4 bg-card border border-border rounded-xl text-sm font-bold text-foreground hover:bg-accent transition-colors flex items-center justify-center gap-2"
          >
            <Phone size={16} /> Appeler
          </a>
          <button
            onClick={() => onUpdateStatus(prospect.id, 'SIGNED')}
            className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Briefcase size={16} /> Marquer Client
          </button>
        </div>
      </motion.div>
    </div>
  );
}
