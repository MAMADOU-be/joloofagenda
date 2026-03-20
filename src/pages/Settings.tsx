import { Moon, Sun } from 'lucide-react';
import { useI18n, LANGUAGES, Language } from '@/lib/i18n';

interface SettingsProps {
  darkMode: boolean;
  onToggleDark: () => void;
}

export default function SettingsPage({ darkMode, onToggleDark }: SettingsProps) {
  const { t, lang, setLang } = useI18n();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-foreground">{t('settings.title')}</h1>

      <div className="bg-card rounded-xl border border-border shadow-sm divide-y divide-border">
        {/* Dark mode */}
        <div className="flex items-center justify-between p-4">
          <div>
            <h3 className="font-semibold text-foreground text-sm">{t('settings.darkMode')}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{t('settings.darkModeDesc')}</p>
          </div>
          <button onClick={onToggleDark} className="p-2.5 rounded-xl border border-border bg-muted active:bg-accent transition-colors">
            {darkMode ? <Sun size={18} className="text-foreground" /> : <Moon size={18} className="text-foreground" />}
          </button>
        </div>

        {/* Language */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground text-sm">{t('settings.language')}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">{t('settings.languageDesc')}</p>
          <div className="flex gap-2">
            {(Object.entries(LANGUAGES) as [Language, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setLang(key)}
                className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  lang === key
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-muted text-muted-foreground border-border active:border-foreground/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground text-sm">{t('settings.about')}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{t('settings.aboutDesc')}</p>
          <p className="text-[10px] text-muted-foreground mt-2 font-mono">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
