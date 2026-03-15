import { Calendar, Globe, Briefcase } from 'lucide-react';
import { Prospect } from '@/lib/types';

interface ClientsProps {
  clients: Prospect[];
}

export default function Clients({ clients }: ClientsProps) {
  const totalRevenue = clients.reduce((sum, c) => sum + (parseFloat(c.proposedPrice) || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Clients</h1>

      {/* Revenue banner */}
      <div className="bg-primary p-6 rounded-2xl text-primary-foreground shadow-xl shadow-primary/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-xs font-bold uppercase opacity-70 tracking-widest">Revenu Total</p>
          <h2 className="text-4xl font-black mt-1 tabular-nums">{totalRevenue.toLocaleString('fr-FR')} €</h2>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase opacity-70 tracking-widest">Contrats Signés</p>
          <h2 className="text-4xl font-black mt-1 tabular-nums">{clients.length}</h2>
        </div>
      </div>

      {/* Client cards */}
      {clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.map(client => (
            <div key={client.id} className="bg-card p-5 rounded-xl border border-border shadow-sm flex justify-between items-center">
              <div>
                <h4 className="font-bold text-foreground">{client.name}</h4>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Calendar size={12} /> Signé le {client.signedDate ? new Date(client.signedDate).toLocaleDateString('fr-FR') : '—'}
                </p>
                {client.websiteUrl && (
                  <a href={client.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-semibold mt-1 flex items-center gap-1 hover:underline">
                    <Globe size={12} /> Voir le site
                  </a>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary tabular-nums">{parseFloat(client.proposedPrice) ? `${parseFloat(client.proposedPrice).toLocaleString('fr-FR')} €` : '—'}</p>
                <p className="text-xs text-muted-foreground mt-1">{client.sector}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-dashed border-border py-20 text-center">
          <div className="inline-flex p-4 bg-muted rounded-full mb-4">
            <Briefcase size={32} className="text-muted-foreground/40" />
          </div>
          <h3 className="text-foreground font-semibold">Aucun client signé pour le moment</h3>
          <p className="text-muted-foreground text-sm mt-1">Continuez la prospection !</p>
        </div>
      )}
    </div>
  );
}
