import { useState, useMemo } from 'react';
import { Search, Download, Filter, MapPin, Users, Plus, Phone, MessageSquare } from 'lucide-react';
import { Prospect, ProspectStatus, STATUSES, SECTORS, Sector } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';
import { SwipeableCard } from '@/components/SwipeableCard';
import { useI18n } from '@/lib/i18n';

interface ProspectsProps {
  prospects: Prospect[];
  onSelect: (prospect: Prospect) => void;
  onExport: () => void;
  onOpenAdd: () => void;
  onUpdateStatus: (id: string, status: ProspectStatus) => void;
}

type SortKey = 'date' | 'name' | 'status';

export default function Prospects({ prospects, onSelect, onExport, onOpenAdd, onUpdateStatus }: ProspectsProps) {
  const { t, locale } = useI18n();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProspectStatus | ''>('');
  const [sectorFilter, setSectorFilter] = useState<Sector | ''>('');
  const [sortBy, setSortBy] = useState<SortKey>('date');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = prospects.filter(p => {
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || p.status === statusFilter;
      const matchesSector = !sectorFilter || p.sector === sectorFilter;
      return matchesSearch && matchesStatus && matchesSector;
    });

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [prospects, search, statusFilter, sectorFilter, sortBy]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-foreground">{t('prospects.title')}</h1>
        <button
          onClick={onOpenAdd}
          className="bg-primary hover:opacity-90 text-primary-foreground text-sm font-semibold w-10 h-10 rounded-full flex items-center justify-center transition-opacity shadow-lg shadow-primary/25"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Search + filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder={t('prospects.search')}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border rounded-full transition-colors ${showFilters ? 'bg-primary text-primary-foreground border-primary' : 'text-muted-foreground border-border bg-card'}`}>
            <Filter size={12} /> {t('prospects.filter')}
          </button>
          <button onClick={onExport} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground border border-border bg-card rounded-full transition-colors">
            <Download size={12} /> CSV
          </button>
          <div className="ml-auto text-xs text-muted-foreground self-center tabular-nums">{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</div>
        </div>
      </div>

      {showFilters && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as ProspectStatus | '')} className="px-3 py-1.5 bg-card border border-border rounded-full text-xs text-foreground outline-none shrink-0">
            <option value="">{t('prospects.allStatuses')}</option>
            {(Object.keys(STATUSES) as ProspectStatus[]).map(key => (
              <option key={key} value={key}>{t(`status.${key}` as any)}</option>
            ))}
          </select>
          <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value as Sector | '')} className="px-3 py-1.5 bg-card border border-border rounded-full text-xs text-foreground outline-none shrink-0">
            <option value="">{t('prospects.allSectors')}</option>
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)} className="px-3 py-1.5 bg-card border border-border rounded-full text-xs text-foreground outline-none shrink-0">
            <option value="date">{t('prospects.sortDate')}</option>
            <option value="name">{t('prospects.sortName')}</option>
            <option value="status">{t('prospects.sortStatus')}</option>
          </select>
        </div>
      )}

      {/* Cards */}
      <div className="space-y-3">
        {filtered.map(p => (
          <div key={p.id} onClick={() => onSelect(p)} className="bg-card border border-border rounded-xl p-4 active:bg-muted cursor-pointer transition-all">
            <div className="flex justify-between items-start mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground text-sm truncate">{p.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin size={11} /> {p.city}</p>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{p.sector}</span>
              <span className="font-mono font-bold text-amber-600">★ {p.rating || '—'}</span>
            </div>
            {p.notes && <p className="text-xs text-muted-foreground mt-2 line-clamp-1 border-t border-border pt-2">{p.notes}</p>}
            <div className="flex gap-3 mt-3 pt-2 border-t border-border">
              {p.phone && (
                <a href={`tel:${p.phone}`} onClick={e => e.stopPropagation()} className="text-xs text-primary font-semibold flex items-center gap-1 active:opacity-70">
                  <Phone size={12} /> {t('prospects.call')}
                </a>
              )}
              {p.phone && (
                <a href={`sms:${p.phone}`} onClick={e => e.stopPropagation()} className="text-xs text-muted-foreground font-semibold flex items-center gap-1 active:opacity-70">
                  <MessageSquare size={12} /> SMS
                </a>
              )}
              <button onClick={e => { e.stopPropagation(); onUpdateStatus(p.id, 'CONTACTED'); }} className="text-xs text-status-contacted font-semibold active:opacity-70 ml-auto">
                {t('prospects.contacted')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <div className="inline-flex p-3 bg-muted rounded-full mb-3">
            <Users size={28} className="text-muted-foreground/40" />
          </div>
          <h3 className="text-foreground font-semibold text-sm">{t('prospects.empty')}</h3>
          <p className="text-muted-foreground text-xs mt-1">{t('prospects.emptyDesc')}</p>
          <button onClick={onOpenAdd} className="mt-3 text-sm text-primary font-semibold active:opacity-70">{t('prospects.addFirst')}</button>
        </div>
      )}
    </div>
  );
}
