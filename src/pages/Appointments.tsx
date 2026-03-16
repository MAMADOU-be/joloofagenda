import { useState, useEffect, useCallback } from 'react';
import { Plus, List, CalendarDays, Clock, MapPin, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  title: string;
  description: string;
  date: string;
  duration_minutes: number;
  location: string;
  status: string;
  prospect_id: string | null;
  prospect_name?: string;
}

interface Prospect {
  id: string;
  name: string;
}

export default function Appointments() {
  const { user } = useAuth();
  const { t } = useI18n();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [showAdd, setShowAdd] = useState(false);
  const [calMonth, setCalMonth] = useState(new Date());

  // Form state
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '09:00', duration: '30', location: '', prospect_id: '' });

  const fetchAll = useCallback(async () => {
    if (!user) return;
    const [{ data: appts }, { data: pros }] = await Promise.all([
      supabase.from('appointments').select('*').eq('user_id', user.id).order('date', { ascending: true }),
      supabase.from('prospects').select('id, name').or(`user_id.eq.${user.id},user_id.is.null`),
    ]);

    const prospectMap = new Map((pros || []).map(p => [p.id, p.name]));
    setProspects((pros || []).map(p => ({ id: p.id, name: p.name })));
    setAppointments((appts || []).map(a => ({ ...a, prospect_name: a.prospect_id ? prospectMap.get(a.prospect_id) : undefined })));
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const dateTime = new Date(`${form.date}T${form.time}`).toISOString();
    const { error } = await supabase.from('appointments').insert({
      user_id: user.id,
      title: form.title,
      description: form.description,
      date: dateTime,
      duration_minutes: parseInt(form.duration),
      location: form.location,
      prospect_id: form.prospect_id || null,
    });
    if (error) { toast({ title: 'Erreur', description: error.message, variant: 'destructive' }); return; }
    setForm({ title: '', description: '', date: '', time: '09:00', duration: '30', location: '', prospect_id: '' });
    setShowAdd(false);
    fetchAll();
  };

  const deleteAppt = async (id: string) => {
    await supabase.from('appointments').delete().eq('id', id);
    fetchAll();
  };

  // Calendar helpers
  const year = calMonth.getFullYear();
  const month = calMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  const apptsByDay = new Map<number, Appointment[]>();
  appointments.forEach(a => {
    const d = new Date(a.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      if (!apptsByDay.has(day)) apptsByDay.set(day, []);
      apptsByDay.get(day)!.push(a);
    }
  });

  const upcoming = appointments.filter(a => new Date(a.date) >= new Date()).slice(0, 10);
  const past = appointments.filter(a => new Date(a.date) < new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Rendez-vous</h1>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-0.5 border border-border">
            <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${view === 'list' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}>
              <List size={14} className="inline mr-1" />Liste
            </button>
            <button onClick={() => setView('calendar')} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${view === 'calendar' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}>
              <CalendarDays size={14} className="inline mr-1" />Calendrier
            </button>
          </div>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity">
            <Plus size={16} /> Nouveau
          </button>
        </div>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/30 animate-fade-in" onClick={() => setShowAdd(false)} />
          <form onSubmit={handleAdd} className="relative bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl animate-modal-in z-10">
            <h2 className="text-lg font-bold text-foreground">Nouveau rendez-vous</h2>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Titre *</label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Date *</label>
                <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Heure *</label>
                <Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Durée (min)</label>
                <Input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} min="5" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Lieu</label>
                <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Prospect lié</label>
              <select value={form.prospect_id} onChange={e => setForm(f => ({ ...f, prospect_id: e.target.value }))} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="">— Aucun —</option>
                {prospects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Annuler</button>
              <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity">Créer</button>
            </div>
          </form>
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="space-y-4">
          {upcoming.length === 0 && past.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <CalendarDays size={40} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Aucun rendez-vous</p>
              <button onClick={() => setShowAdd(true)} className="mt-3 text-primary font-semibold text-sm hover:underline">+ Ajouter un rendez-vous</button>
            </div>
          )}
          {upcoming.length > 0 && (
            <>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">À venir</h2>
              <div className="space-y-2">
                {upcoming.map(a => <AppointmentCard key={a.id} appointment={a} onDelete={deleteAppt} />)}
              </div>
            </>
          )}
          {past.length > 0 && (
            <>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mt-6">Passés</h2>
              <div className="space-y-2 opacity-60">
                {past.map(a => <AppointmentCard key={a.id} appointment={a} onDelete={deleteAppt} />)}
              </div>
            </>
          )}
        </div>
      )}

      {/* Calendar view */}
      {view === 'calendar' && (
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCalMonth(new Date(year, month - 1))} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><ChevronLeft size={18} /></button>
            <h3 className="font-bold text-foreground">{monthNames[month]} {year}</h3>
            <button onClick={() => setCalMonth(new Date(year, month + 1))} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><ChevronRight size={18} /></button>
          </div>
          <div className="grid grid-cols-7 gap-px">
            {dayNames.map(d => <div key={d} className="text-center text-xs font-bold text-muted-foreground py-2">{d}</div>)}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayAppts = apptsByDay.get(day) || [];
              const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
              return (
                <div key={day} className={`min-h-[80px] p-1 rounded-lg border transition-colors ${isToday ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted/50'}`}>
                  <span className={`text-xs font-semibold ${isToday ? 'text-primary' : 'text-foreground'}`}>{day}</span>
                  {dayAppts.map(a => (
                    <div key={a.id} className="mt-0.5 px-1 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium truncate">
                      {new Date(a.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} {a.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ appointment: a, onDelete }: { appointment: Appointment; onDelete: (id: string) => void }) {
  const d = new Date(a.date);
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-3 hover:shadow-sm transition-shadow">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground truncate">{a.title}</h3>
          {a.prospect_name && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium shrink-0">{a.prospect_name}</span>}
        </div>
        <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><CalendarDays size={12} />{d.toLocaleDateString('fr-FR')}</span>
          <span className="flex items-center gap-1"><Clock size={12} />{d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} · {a.duration_minutes}min</span>
          {a.location && <span className="flex items-center gap-1"><MapPin size={12} />{a.location}</span>}
        </div>
        {a.description && <p className="text-xs text-muted-foreground mt-1 truncate">{a.description}</p>}
      </div>
      <button onClick={() => onDelete(a.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
