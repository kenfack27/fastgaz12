import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cm.kapexpert.fastgaz',
  appName: 'FastGaz',
  webDir: 'www',
   server: {
    url: 'https://kapexpert.cloud:30004/', // Remplace par l'URL de ton frontend hébergé
    cleartext: true 
  },
  plugins: {
  SplashScreen: {
    launchShowDuration: 0,
    androidSplashResourceName: 'splash',
    androidScaleType: 'CENTER_CROP',
    showSpinner: false,
    splashFullScreen: true,
    splashImmersive: true,
    layoutName: 'launch_screen',
    useDialog: true
  },
  StatusBar: {
    style: 'DARK', // ou 'LIGHT'
    backgroundColor: '#ffffff'
  }
},
cordova: {
  preferences: {
    StatusBarStyle: 'default',
    StatusBarOverlaysWebView: 'false'
  }
}


};

export default config;
