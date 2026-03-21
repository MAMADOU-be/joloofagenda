import { useState, useEffect, useCallback } from 'react';
import { Plus, List, CalendarDays, Clock, MapPin, Trash2, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';

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
  reminder_minutes: number;
}

const REMINDER_OPTIONS = [
  { value: '0', label: 'Aucun' },
  { value: '1', label: '1 minute avant' },
  { value: '5', label: '5 minutes avant' },
  { value: '15', label: '15 minutes avant' },
  { value: '30', label: '30 minutes avant' },
  { value: '60', label: '1 heure avant' },
  { value: '1440', label: '1 jour avant' },
];

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

  const [form, setForm] = useState({ title: '', description: '', date: '', time: '09:00', duration: '30', location: '', prospect_id: '', reminder: '30' });

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

  const { scheduleReminders } = useNotifications();

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Schedule push notifications for upcoming appointments
  useEffect(() => {
    if (appointments.length > 0) {
      const upcoming = appointments.filter(a => new Date(a.date) > new Date());
      scheduleReminders(upcoming);
    }
  }, [appointments, scheduleReminders]);

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

  const year = calMonth.getFullYear();
  const month = calMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Rendez-vous</h1>
        <button onClick={() => setShowAdd(true)} className="bg-primary text-primary-foreground font-semibold w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-primary/25">
          <Plus size={20} />
        </button>
      </div>

      {/* View toggle */}
      <div className="flex bg-muted rounded-xl p-1 border border-border">
        <button onClick={() => setView('list')} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${view === 'list' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}>
          <List size={14} />Liste
        </button>
        <button onClick={() => setView('calendar')} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${view === 'calendar' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}>
          <CalendarDays size={14} />Calendrier
        </button>
      </div>

      {/* Add modal - full screen sheet */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setShowAdd(false)} />
          <form onSubmit={handleAdd} className="relative bg-card rounded-t-2xl p-5 space-y-3 shadow-xl z-10 max-h-[90vh] overflow-y-auto safe-area-bottom">
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-2" />
            <h2 className="text-base font-bold text-foreground">Nouveau rendez-vous</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Titre *</label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className="h-11" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Date *</label>
                <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required className="h-11" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Heure *</label>
                <Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} required className="h-11" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Durée (min)</label>
                <Input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} min="5" className="h-11" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Lieu</label>
                <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="h-11" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Prospect lié</label>
              <select value={form.prospect_id} onChange={e => setForm(f => ({ ...f, prospect_id: e.target.value }))} className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm">
                <option value="">— Aucun —</option>
                {prospects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[50px]" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 text-sm font-semibold text-muted-foreground bg-muted rounded-xl">Annuler</button>
              <button type="submit" className="flex-1 py-3 bg-primary text-primary-foreground text-sm font-bold rounded-xl shadow-lg shadow-primary/20">Créer</button>
            </div>
          </form>
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="space-y-3">
          {upcoming.length === 0 && past.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-10 text-center">
              <CalendarDays size={32} className="mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">Aucun rendez-vous</p>
              <button onClick={() => setShowAdd(true)} className="mt-2 text-primary font-semibold text-sm active:opacity-70">+ Ajouter</button>
            </div>
          )}
          {upcoming.length > 0 && (
            <>
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">À venir</h2>
              {upcoming.map(a => <AppointmentCard key={a.id} appointment={a} onDelete={deleteAppt} />)}
            </>
          )}
          {past.length > 0 && (
            <>
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-4">Passés</h2>
              <div className="opacity-50 space-y-2">
                {past.map(a => <AppointmentCard key={a.id} appointment={a} onDelete={deleteAppt} />)}
              </div>
            </>
          )}
        </div>
      )}

      {/* Calendar view */}
      {view === 'calendar' && (
        <div className="bg-card border border-border rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setCalMonth(new Date(year, month - 1))} className="p-2 rounded-lg active:bg-muted text-muted-foreground"><ChevronLeft size={18} /></button>
            <h3 className="font-bold text-foreground text-sm">{monthNames[month]} {year}</h3>
            <button onClick={() => setCalMonth(new Date(year, month + 1))} className="p-2 rounded-lg active:bg-muted text-muted-foreground"><ChevronRight size={18} /></button>
          </div>
          <div className="grid grid-cols-7 gap-px">
            {dayNames.map((d, i) => <div key={i} className="text-center text-[10px] font-bold text-muted-foreground py-1.5">{d}</div>)}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayAppts = apptsByDay.get(day) || [];
              const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
              return (
                <div key={day} className={`min-h-[44px] p-1 rounded-lg text-center transition-colors ${isToday ? 'bg-primary/10 ring-1 ring-primary/30' : ''}`}>
                  <span className={`text-xs font-semibold ${isToday ? 'text-primary' : 'text-foreground'}`}>{day}</span>
                  {dayAppts.length > 0 && (
                    <div className="flex justify-center gap-0.5 mt-0.5">
                      {dayAppts.slice(0, 3).map((_, j) => (
                        <div key={j} className="w-1 h-1 rounded-full bg-primary" />
                      ))}
                    </div>
                  )}
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
    <div className="bg-card border border-border rounded-xl p-3.5 flex items-start gap-3">
      {/* Date pill */}
      <div className="shrink-0 bg-primary/10 rounded-xl w-12 h-12 flex flex-col items-center justify-center">
        <span className="text-xs font-bold text-primary leading-none">{d.getDate()}</span>
        <span className="text-[9px] text-primary/70 font-medium uppercase">{d.toLocaleDateString('fr-FR', { month: 'short' })}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground text-sm truncate">{a.title}</h3>
          {a.prospect_name && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium shrink-0">{a.prospect_name}</span>}
        </div>
        <div className="flex flex-wrap gap-2 mt-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-0.5"><Clock size={10} />{d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} · {a.duration_minutes}min</span>
          {a.location && <span className="flex items-center gap-0.5"><MapPin size={10} />{a.location}</span>}
        </div>
      </div>
      <button onClick={() => onDelete(a.id)} className="p-2 rounded-lg text-muted-foreground active:text-destructive active:bg-destructive/10 transition-colors shrink-0">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
