export type ProspectStatus = 'PROSPECT' | 'CONTACTED' | 'DEMO' | 'SIGNED' | 'REFUSED';

export type Sector = 'Médical' | 'Commerce' | 'Restaurant' | 'Autre';

export type Source = 'Google Maps' | 'Recommandation' | 'Autre';

export interface Activity {
  id: string;
  date: string;
  text: string;
}

export interface Prospect {
  id: string;
  name: string;
  sector: Sector;
  address: string;
  city: string;
  phone: string;
  rating: string;
  reviewCount: string;
  notes: string;
  source: Source;
  status: ProspectStatus;
  createdAt: string;
  activities: Activity[];
  demoLink: string;
  proposedPrice: string;
  websiteUrl: string;
  renewalDate: string;
  signedDate: string;
}

export const STATUSES: Record<ProspectStatus, { label: string; bgClass: string; textClass: string }> = {
  PROSPECT: { label: 'Prospect', bgClass: 'bg-status-prospect/10', textClass: 'text-status-prospect' },
  CONTACTED: { label: 'Contacté', bgClass: 'bg-status-contacted/10', textClass: 'text-status-contacted' },
  DEMO: { label: 'Démo envoyée', bgClass: 'bg-status-demo/10', textClass: 'text-status-demo' },
  SIGNED: { label: 'Signé', bgClass: 'bg-status-signed/10', textClass: 'text-status-signed' },
  REFUSED: { label: 'Refus', bgClass: 'bg-status-refused/10', textClass: 'text-status-refused' },
};

export const SECTORS: Sector[] = ['Médical', 'Commerce', 'Restaurant', 'Autre'];
export const SOURCES: Source[] = ['Google Maps', 'Recommandation', 'Autre'];
