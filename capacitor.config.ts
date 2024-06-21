import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'mx.ramirex.mini-pos',
  appName: 'Mini POS',
  webDir: 'www',
  server: {
    androidScheme: 'http',
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
