import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.joloofagenda',
  appName: 'joloofagenda',
  webDir: 'dist',
  server: {
    url: 'https://3691094f-78c9-4e72-beb4-544987be3db3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
