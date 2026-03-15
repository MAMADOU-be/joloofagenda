import { useState, useMemo } from 'react';
import { Search, Download, Filter, ChevronRight, MapPin, Users, Plus, LayoutGrid, List, Phone, MessageSquare, ArrowUpDown } from 'lucide-react';
import { Prospect, ProspectStatus, STATUSES, SECTORS, Sector } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';

interface ProspectsProps {
  prospects: Prospect[];
  onSelect: (prospect: Prospect) => void;
  onExport: () => void;
  onOpenAdd: () => void;
  onUpdateStatus: (id: string, status: ProspectStatus) => void;
}

type SortKey = 'date' | 'name' | 'status';
type ViewMode = 'table' | 'card';

export default function Prospects({ prospects, onSelect, onExport, onOpenAdd, onUpdateStatus }: ProspectsProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProspectStatus | ''>('');
  const [sectorFilter, setSectorFilter] = useState<Sector | ''>('');
  const [sortBy, setSortBy] = useState<SortKey>('date');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Prospects</h1>
        <button
          onClick={onOpenAdd}
          className="bg-primary hover:opacity-90 text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-opacity shadow-sm"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Rechercher un cabinet ou une ville..."
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button onClick={() => setViewMode('table')} className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                <List size={16} />
              </button>
              <button onClick={() => setViewMode('card')} className={`p-2 transition-colors ${viewMode === 'card' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                <LayoutGrid size={16} />
              </button>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted border border-border rounded-lg transition-colors">
              <Filter size={16} /> Filtrer
            </button>
            <button onClick={onExport} className="p-2 text-muted-foreground hover:bg-muted rounded-lg border border-border transition-colors" title="Exporter CSV">
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="p-4 border-b border-border bg-muted/50 flex flex-wrap gap-3">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as ProspectStatus | '')} className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm text-foreground outline-none">
              <option value="">Tous les statuts</option>
              {(Object.entries(STATUSES) as [ProspectStatus, typeof STATUSES[ProspectStatus]][]).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value as Sector | '')} className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm text-foreground outline-none">
              <option value="">Tous les secteurs</option>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)} className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm text-foreground outline-none">
              <option value="date">Trier par date</option>
              <option value="name">Trier par nom</option>
              <option value="status">Trier par statut</option>
            </select>
          </div>
        )}

        {/* Table view */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 text-[11px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border">
                  <th className="px-6 py-3">Cabinet</th>
                  <th className="px-6 py-3">Secteur</th>
                  <th className="px-6 py-3">Ville</th>
                  <th className="px-6 py-3">Téléphone</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3">Note</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-muted/50 cursor-pointer transition-colors group" onClick={() => onSelect(p)}>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-foreground">{p.name}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{p.sector}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin size={12} /> {p.city}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono">{p.phone || '—'}</td>
                    <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-bold text-amber-600">★ {p.rating || '—'}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono">{new Date(p.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {p.phone && (
                          <a href={`tel:${p.phone}`} onClick={e => e.stopPropagation()} className="p-1.5 hover:bg-muted rounded-md text-muted-foreground" title="Appeler">
                            <Phone size={14} />
                          </a>
                        )}
                        <a href={`sms:${p.phone}`} onClick={e => e.stopPropagation()} className="p-1.5 hover:bg-muted rounded-md text-muted-foreground" title="Message">
                          <MessageSquare size={14} />
                        </a>
                        <ChevronRight size={16} className="text-muted-foreground" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Card view */}
        {viewMode === 'card' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(p => (
              <div key={p.id} onClick={() => onSelect(p)} className="bg-card border border-border rounded-xl p-4 hover:shadow-md cursor-pointer transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{p.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin size={11} /> {p.city}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{p.sector}</span>
                  <span className="font-mono font-bold text-amber-600">★ {p.rating || '—'}</span>
                </div>
                {p.notes && <p className="text-xs text-muted-foreground mt-2 line-clamp-2 border-t border-border pt-2">{p.notes}</p>}
                <div className="flex gap-2 mt-3 pt-2 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
                  {p.phone && (
                    <a href={`tel:${p.phone}`} onClick={e => e.stopPropagation()} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
                      <Phone size={12} /> Appeler
                    </a>
                  )}
                  <button onClick={e => { e.stopPropagation(); onUpdateStatus(p.id, 'CONTACTED'); }} className="text-xs text-status-contacted font-semibold hover:underline ml-auto">
                    → Contacté
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex p-4 bg-muted rounded-full mb-4">
              <Users size={32} className="text-muted-foreground/40" />
            </div>
            <h3 className="text-foreground font-semibold">Aucun prospect trouvé</h3>
            <p className="text-muted-foreground text-sm mt-1">Commencez par ajouter votre premier prospect local.</p>
            <button onClick={onOpenAdd} className="mt-4 text-sm text-primary font-semibold hover:underline">+ Ajouter un prospect</button>
          </div>
        )}
      </div>
    </div>
  );
}
