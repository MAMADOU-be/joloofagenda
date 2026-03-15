import { Moon, Sun } from 'lucide-react';

interface SettingsProps {
  darkMode: boolean;
  onToggleDark: () => void;
}

export default function SettingsPage({ darkMode, onToggleDark }: SettingsProps) {
  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Mode sombre</h3>
            <p className="text-sm text-muted-foreground">Basculer entre le thème clair et sombre</p>
          </div>
          <button
            onClick={onToggleDark}
            className="p-3 rounded-lg border border-border bg-muted hover:bg-accent transition-colors"
          >
            {darkMode ? <Sun size={20} className="text-foreground" /> : <Moon size={20} className="text-foreground" />}
          </button>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="font-semibold text-foreground">À propos</h3>
          <p className="text-sm text-muted-foreground mt-1">
            L'Artisan CRM — Gestion de prospects et clients pour développeurs freelance.
          </p>
          <p className="text-xs text-muted-foreground mt-2">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
