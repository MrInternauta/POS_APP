import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'mx.ramirex.minipos',
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
  ios: {
    loggingBehavior: 'debug',
  },
};

export default config;
