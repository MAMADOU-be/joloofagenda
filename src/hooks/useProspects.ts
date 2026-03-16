import { useState, useEffect, useCallback } from 'react';
import { Prospect, ProspectStatus, Activity } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

export function useProspects() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);

  // Load prospects from DB
  const fetchProspects = useCallback(async () => {
    const { data: prospectRows, error } = await supabase
      .from('prospects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching prospects:', error);
      setLoading(false);
      return;
    }

    // Fetch activities for all prospects
    const ids = (prospectRows || []).map(p => p.id);
    let activitiesMap: Record<string, Activity[]> = {};

    if (ids.length > 0) {
      const { data: activityRows } = await supabase
        .from('activities')
        .select('*')
        .in('prospect_id', ids)
        .order('date', { ascending: false });

      (activityRows || []).forEach(a => {
        if (!activitiesMap[a.prospect_id]) activitiesMap[a.prospect_id] = [];
        activitiesMap[a.prospect_id].push({ id: a.id, date: a.date, text: a.text });
      });
    }

    const mapped: Prospect[] = (prospectRows || []).map(p => ({
      id: p.id,
      name: p.name,
      sector: p.sector as Prospect['sector'],
      address: p.address || '',
      city: p.city || '',
      phone: p.phone || '',
      rating: p.rating || '',
      reviewCount: p.review_count || '',
      notes: p.notes || '',
      source: p.source as Prospect['source'],
      status: p.status as ProspectStatus,
      createdAt: p.created_at,
      activities: activitiesMap[p.id] || [],
      demoLink: p.demo_link || '',
      proposedPrice: p.proposed_price || '',
      websiteUrl: p.website_url || '',
      renewalDate: p.renewal_date || '',
      signedDate: p.signed_date || '',
    }));

    setProspects(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProspects();
  }, [fetchProspects]);

  const addProspect = useCallback(async (data: Omit<Prospect, 'id' | 'status' | 'createdAt' | 'activities' | 'demoLink' | 'proposedPrice' | 'websiteUrl' | 'renewalDate' | 'signedDate'>) => {
    const { data: inserted, error } = await supabase
      .from('prospects')
      .insert({
        name: data.name,
        sector: data.sector,
        address: data.address,
        city: data.city,
        phone: data.phone,
        rating: data.rating,
        review_count: data.reviewCount,
        notes: data.notes,
        source: data.source,
        status: 'PROSPECT',
      })
      .select()
      .single();

    if (error || !inserted) {
      console.error('Error adding prospect:', error);
      return null;
    }

    // Add initial activity
    await supabase.from('activities').insert({
      prospect_id: inserted.id,
      text: 'Prospect ajouté au système',
    });

    await fetchProspects();
    return inserted;
  }, [fetchProspects]);

  const updateProspect = useCallback(async (id: string, updates: Partial<Prospect>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.sector !== undefined) dbUpdates.sector = updates.sector;
    if (updates.address !== undefined) dbUpdates.address = updates.address;
    if (updates.city !== undefined) dbUpdates.city = updates.city;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
    if (updates.reviewCount !== undefined) dbUpdates.review_count = updates.reviewCount;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.source !== undefined) dbUpdates.source = updates.source;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.demoLink !== undefined) dbUpdates.demo_link = updates.demoLink;
    if (updates.proposedPrice !== undefined) dbUpdates.proposed_price = updates.proposedPrice;
    if (updates.websiteUrl !== undefined) dbUpdates.website_url = updates.websiteUrl;
    if (updates.renewalDate !== undefined) dbUpdates.renewal_date = updates.renewalDate;
    if (updates.signedDate !== undefined) dbUpdates.signed_date = updates.signedDate;

    await supabase.from('prospects').update(dbUpdates).eq('id', id);
    await fetchProspects();
  }, [fetchProspects]);

  const updateStatus = useCallback(async (id: string, newStatus: ProspectStatus) => {
    const updates: Record<string, unknown> = { status: newStatus };
    if (newStatus === 'SIGNED') updates.signed_date = new Date().toISOString();

    await supabase.from('prospects').update(updates).eq('id', id);

    const statusLabel = newStatus === 'PROSPECT' ? 'Prospect' : newStatus === 'CONTACTED' ? 'Contacté' : newStatus === 'DEMO' ? 'Démo envoyée' : newStatus === 'SIGNED' ? 'Signé' : 'Refus';
    await supabase.from('activities').insert({
      prospect_id: id,
      text: `Statut changé en ${statusLabel}`,
    });

    await fetchProspects();
  }, [fetchProspects]);

  const addActivity = useCallback(async (id: string, text: string) => {
    await supabase.from('activities').insert({
      prospect_id: id,
      text,
    });
    await fetchProspects();
  }, [fetchProspects]);

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

  return { prospects, loading, addProspect, updateProspect, updateStatus, addActivity, exportToCSV };
}
