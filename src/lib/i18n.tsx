import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Language = 'fr' | 'en' | 'nl';

export const LANGUAGES: Record<Language, string> = {
  fr: 'Français',
  en: 'English',
  nl: 'Nederlands',
};

const translations = {
  // Sidebar
  'nav.dashboard': { fr: 'Tableau de bord', en: 'Dashboard', nl: 'Dashboard' },
  'nav.prospects': { fr: 'Prospects', en: 'Prospects', nl: 'Prospecten' },
  'nav.clients': { fr: 'Clients', en: 'Clients', nl: 'Klanten' },
  'nav.settings': { fr: 'Paramètres', en: 'Settings', nl: 'Instellingen' },
  'sidebar.monthlyGoal': { fr: 'Objectif Mensuel', en: 'Monthly Goal', nl: 'Maanddoel' },
  'sidebar.signatures': { fr: 'Signatures', en: 'Signatures', nl: 'Handtekeningen' },

  // Dashboard
  'dashboard.title': { fr: 'Tableau de bord', en: 'Dashboard', nl: 'Dashboard' },
  'dashboard.add': { fr: 'Ajouter', en: 'Add', nl: 'Toevoegen' },
  'dashboard.totalProspects': { fr: 'Total Prospects', en: 'Total Prospects', nl: 'Totaal Prospecten' },
  'dashboard.contacted': { fr: 'Contactés', en: 'Contacted', nl: 'Gecontacteerd' },
  'dashboard.demos': { fr: 'Démos', en: 'Demos', nl: "Demo's" },
  'dashboard.signed': { fr: 'Signés', en: 'Signed', nl: 'Getekend' },
  'dashboard.refused': { fr: 'Refus', en: 'Refused', nl: 'Geweigerd' },
  'dashboard.funnel': { fr: 'Tunnel de Conversion', en: 'Conversion Funnel', nl: 'Conversietrechter' },
  'dashboard.funnelProspects': { fr: 'Prospects', en: 'Prospects', nl: 'Prospecten' },
  'dashboard.funnelContacted': { fr: 'Contactés', en: 'Contacted', nl: 'Gecontacteerd' },
  'dashboard.funnelDemos': { fr: 'Démos', en: 'Demos', nl: "Demo's" },
  'dashboard.funnelSigned': { fr: 'Signés', en: 'Signed', nl: 'Getekend' },
  'dashboard.recentActivity': { fr: 'Activités Récentes', en: 'Recent Activities', nl: 'Recente Activiteiten' },
  'dashboard.noActivity': { fr: 'Aucune activité pour le moment', en: 'No activity yet', nl: 'Nog geen activiteit' },
  'dashboard.addProspect': { fr: 'Ajouter un prospect', en: 'Add a prospect', nl: 'Prospect toevoegen' },

  // Prospects page
  'prospects.title': { fr: 'Prospects', en: 'Prospects', nl: 'Prospecten' },
  'prospects.search': { fr: 'Rechercher un cabinet ou une ville...', en: 'Search a practice or city...', nl: 'Zoek een praktijk of stad...' },
  'prospects.filter': { fr: 'Filtrer', en: 'Filter', nl: 'Filteren' },
  'prospects.allStatuses': { fr: 'Tous les statuts', en: 'All statuses', nl: 'Alle statussen' },
  'prospects.allSectors': { fr: 'Tous les secteurs', en: 'All sectors', nl: 'Alle sectoren' },
  'prospects.sortDate': { fr: 'Trier par date', en: 'Sort by date', nl: 'Sorteren op datum' },
  'prospects.sortName': { fr: 'Trier par nom', en: 'Sort by name', nl: 'Sorteren op naam' },
  'prospects.sortStatus': { fr: 'Trier par statut', en: 'Sort by status', nl: 'Sorteren op status' },
  'prospects.cabinet': { fr: 'Cabinet', en: 'Practice', nl: 'Praktijk' },
  'prospects.sector': { fr: 'Secteur', en: 'Sector', nl: 'Sector' },
  'prospects.city': { fr: 'Ville', en: 'City', nl: 'Stad' },
  'prospects.phone': { fr: 'Téléphone', en: 'Phone', nl: 'Telefoon' },
  'prospects.status': { fr: 'Statut', en: 'Status', nl: 'Status' },
  'prospects.rating': { fr: 'Note', en: 'Rating', nl: 'Beoordeling' },
  'prospects.date': { fr: 'Date', en: 'Date', nl: 'Datum' },
  'prospects.actions': { fr: 'Actions', en: 'Actions', nl: 'Acties' },
  'prospects.call': { fr: 'Appeler', en: 'Call', nl: 'Bellen' },
  'prospects.contacted': { fr: '→ Contacté', en: '→ Contacted', nl: '→ Gecontacteerd' },
  'prospects.empty': { fr: 'Aucun prospect trouvé', en: 'No prospects found', nl: 'Geen prospecten gevonden' },
  'prospects.emptyDesc': { fr: 'Commencez par ajouter votre premier prospect local.', en: 'Start by adding your first local prospect.', nl: 'Begin met het toevoegen van uw eerste lokale prospect.' },
  'prospects.addFirst': { fr: '+ Ajouter un prospect', en: '+ Add a prospect', nl: '+ Prospect toevoegen' },

  // Add prospect modal
  'modal.title': { fr: 'Nouveau Prospect', en: 'New Prospect', nl: 'Nieuw Prospect' },
  'modal.name': { fr: 'Nom du Cabinet', en: 'Practice Name', nl: 'Praktijknaam' },
  'modal.sector': { fr: 'Secteur', en: 'Sector', nl: 'Sector' },
  'modal.source': { fr: 'Source', en: 'Source', nl: 'Bron' },
  'modal.address': { fr: 'Adresse', en: 'Address', nl: 'Adres' },
  'modal.city': { fr: 'Ville', en: 'City', nl: 'Stad' },
  'modal.phone': { fr: 'Téléphone', en: 'Phone', nl: 'Telefoon' },
  'modal.googleRating': { fr: 'Note Google', en: 'Google Rating', nl: 'Google Beoordeling' },
  'modal.reviewCount': { fr: "Nombre d'avis", en: 'Review Count', nl: 'Aantal beoordelingen' },
  'modal.notes': { fr: 'Notes', en: 'Notes', nl: 'Notities' },
  'modal.submit': { fr: 'Créer la fiche prospect', en: 'Create prospect', nl: 'Prospect aanmaken' },

  // Prospect detail
  'detail.contact': { fr: 'Coordonnées', en: 'Contact Info', nl: 'Contactgegevens' },
  'detail.notProvided': { fr: 'Non renseigné', en: 'Not provided', nl: 'Niet opgegeven' },
  'detail.googleMaps': { fr: 'Google Maps', en: 'Google Maps', nl: 'Google Maps' },
  'detail.reviews': { fr: 'avis', en: 'reviews', nl: 'beoordelingen' },
  'detail.source': { fr: 'Source', en: 'Source', nl: 'Bron' },
  'detail.notes': { fr: 'Notes', en: 'Notes', nl: 'Notities' },
  'detail.demoLink': { fr: 'Lien démo Lovable', en: 'Lovable Demo Link', nl: 'Lovable Demo Link' },
  'detail.proposedPrice': { fr: 'Prix proposé', en: 'Proposed Price', nl: 'Voorgestelde prijs' },
  'detail.changeStatus': { fr: 'Changer le statut', en: 'Change Status', nl: 'Status wijzigen' },
  'detail.activityHistory': { fr: "Historique d'activité", en: 'Activity History', nl: 'Activiteitengeschiedenis' },
  'detail.addActivity': { fr: 'Ajouter une activité...', en: 'Add an activity...', nl: 'Activiteit toevoegen...' },
  'detail.callBtn': { fr: 'Appeler', en: 'Call', nl: 'Bellen' },
  'detail.markClient': { fr: 'Marquer Client', en: 'Mark as Client', nl: 'Markeer als klant' },
  'detail.addedOn': { fr: 'Ajouté le', en: 'Added on', nl: 'Toegevoegd op' },

  // Clients page
  'clients.title': { fr: 'Clients', en: 'Clients', nl: 'Klanten' },
  'clients.totalRevenue': { fr: 'Revenu Total', en: 'Total Revenue', nl: 'Totale Omzet' },
  'clients.signedContracts': { fr: 'Contrats Signés', en: 'Signed Contracts', nl: 'Getekende Contracten' },
  'clients.signedOn': { fr: 'Signé le', en: 'Signed on', nl: 'Getekend op' },
  'clients.viewSite': { fr: 'Voir le site', en: 'View site', nl: 'Bekijk site' },
  'clients.empty': { fr: 'Aucun client signé pour le moment', en: 'No signed clients yet', nl: 'Nog geen getekende klanten' },
  'clients.emptyDesc': { fr: 'Continuez la prospection !', en: 'Keep prospecting!', nl: 'Ga door met prospecteren!' },

  // Settings
  'settings.title': { fr: 'Paramètres', en: 'Settings', nl: 'Instellingen' },
  'settings.darkMode': { fr: 'Mode sombre', en: 'Dark Mode', nl: 'Donkere modus' },
  'settings.darkModeDesc': { fr: 'Basculer entre le thème clair et sombre', en: 'Toggle between light and dark theme', nl: 'Schakel tussen licht en donker thema' },
  'settings.language': { fr: 'Langue', en: 'Language', nl: 'Taal' },
  'settings.languageDesc': { fr: "Choisir la langue de l'interface", en: 'Choose the interface language', nl: 'Kies de interfacetaal' },
  'settings.about': { fr: 'À propos', en: 'About', nl: 'Over' },
  'settings.aboutDesc': { fr: "L'Artisan CRM — Gestion de prospects et clients pour développeurs freelance.", en: "L'Artisan CRM — Prospect and client management for freelance developers.", nl: "L'Artisan CRM — Prospect- en klantbeheer voor freelance ontwikkelaars." },

  // Statuses
  'status.PROSPECT': { fr: 'Prospect', en: 'Prospect', nl: 'Prospect' },
  'status.CONTACTED': { fr: 'Contacté', en: 'Contacted', nl: 'Gecontacteerd' },
  'status.DEMO': { fr: 'Démo envoyée', en: 'Demo Sent', nl: 'Demo verzonden' },
  'status.SIGNED': { fr: 'Signé', en: 'Signed', nl: 'Getekend' },
  'status.REFUSED': { fr: 'Refus', en: 'Refused', nl: 'Geweigerd' },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  locale: string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('artisan_lang') as Language;
    return saved && saved in LANGUAGES ? saved : 'fr';
  });

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    localStorage.setItem('artisan_lang', l);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return translations[key]?.[lang] ?? key;
  }, [lang]);

  const locale = lang === 'nl' ? 'nl-NL' : lang === 'en' ? 'en-GB' : 'fr-FR';

  return (
    <I18nContext.Provider value={{ lang, setLang, t, locale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
