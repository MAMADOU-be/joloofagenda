import { Moon, Sun } from 'lucide-react';
import { useI18n, LANGUAGES, Language } from '@/lib/i18n';

interface SettingsProps {
  darkMode: boolean;
  onToggleDark: () => void;
}

export default function SettingsPage({ darkMode, onToggleDark }: SettingsProps) {
  const { t, lang, setLang } = useI18n();

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-foreground">{t('settings.title')}</h1>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
        {/* Dark mode */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{t('settings.darkMode')}</h3>
            <p className="text-sm text-muted-foreground">{t('settings.darkModeDesc')}</p>
          </div>
          <button onClick={onToggleDark} className="p-3 rounded-lg border border-border bg-muted hover:bg-accent transition-colors">
            {darkMode ? <Sun size={20} className="text-foreground" /> : <Moon size={20} className="text-foreground" />}
          </button>
        </div>

        {/* Language */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{t('settings.language')}</h3>
              <p className="text-sm text-muted-foreground">{t('settings.languageDesc')}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {(Object.entries(LANGUAGES) as [Language, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setLang(key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  lang === key
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-muted text-muted-foreground border-border hover:border-foreground/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="border-t border-border pt-6">
          <h3 className="font-semibold text-foreground">{t('settings.about')}</h3>
          <p className="text-sm text-muted-foreground mt-1">{t('settings.aboutDesc')}</p>
          <p className="text-xs text-muted-foreground mt-2">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
