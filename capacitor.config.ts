import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'mx.ramirex.mini-pos',
  appName: 'Mini POS',
  webDir: 'www/browser',
  loggingBehavior: 'debug',
  server: {
    androidScheme: 'http',
    cleartext: true,
  },
  backgroundColor: '#ffffff',
  android: {
    allowMixedContent: false,
  },
};

export default config;
