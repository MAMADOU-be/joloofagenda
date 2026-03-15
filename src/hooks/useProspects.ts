import { useState, useEffect, useCallback } from 'react';
import { Prospect, ProspectStatus } from '@/lib/types';
import { loadProspects, saveProspects } from '@/lib/store';

export function useProspects() {
  const [prospects, setProspects] = useState<Prospect[]>(loadProspects);

  useEffect(() => {
    saveProspects(prospects);
  }, [prospects]);

  const addProspect = useCallback((data: Omit<Prospect, 'id' | 'status' | 'createdAt' | 'activities' | 'demoLink' | 'proposedPrice' | 'websiteUrl' | 'renewalDate' | 'signedDate'>) => {
    const newProspect: Prospect = {
      ...data,
      id: crypto.randomUUID(),
      status: 'PROSPECT',
      createdAt: new Date().toISOString(),
      activities: [{ id: crypto.randomUUID(), date: new Date().toISOString(), text: 'Prospect ajouté au système' }],
      demoLink: '',
      proposedPrice: '',
      websiteUrl: '',
      renewalDate: '',
      signedDate: '',
    };
    setProspects(prev => [newProspect, ...prev]);
    return newProspect;
  }, []);

  const updateProspect = useCallback((id: string, updates: Partial<Prospect>) => {
    setProspects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const updateStatus = useCallback((id: string, newStatus: ProspectStatus) => {
    setProspects(prev => prev.map(p => {
      if (p.id !== id) return p;
      const activity = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        text: `Statut changé en ${newStatus === 'PROSPECT' ? 'Prospect' : newStatus === 'CONTACTED' ? 'Contacté' : newStatus === 'DEMO' ? 'Démo envoyée' : newStatus === 'SIGNED' ? 'Signé' : 'Refus'}`,
      };
      return {
        ...p,
        status: newStatus,
        signedDate: newStatus === 'SIGNED' ? new Date().toISOString() : p.signedDate,
        activities: [activity, ...p.activities],
      };
    }));
  }, []);

  const addActivity = useCallback((id: string, text: string) => {
    setProspects(prev => prev.map(p => {
      if (p.id !== id) return p;
      return {
        ...p,
        activities: [{ id: crypto.randomUUID(), date: new Date().toISOString(), text }, ...p.activities],
      };
    }));
  }, []);

  const exportToCSV = useCallback(() => {
    const headers = "Nom,Secteur,Ville,Téléphone,Statut,Note Google,Date\n";
    const rows = prospects.map(p =>
      `"${p.name}","${p.sector}","${p.city}","${p.phone}","${p.status}","${p.rating}","${p.createdAt}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prospects_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [prospects]);

  return { prospects, addProspect, updateProspect, updateStatus, addActivity, exportToCSV };
}
