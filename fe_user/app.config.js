import 'dotenv/config';
import os from 'os';

// Hàm tự động lấy IP LAN
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const ifaceName of Object.keys(interfaces)) {
    for (const alias of interfaces[ifaceName] || []) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost';
}

const ipAddress = getLocalIpAddress();
const port = process.env.PORT || 3000;
const apiUrl = `http://${ipAddress}:${port}`;

console.log('====================================================');
console.log(`[CONFIG] API URL: ${apiUrl}`);
console.log('====================================================');

export default {
  expo: {
    name: '',
    slug: 'fe_user',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/iconHuyViVu.png',
    scheme: 'feuser',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: { supportsTablet: true },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      usesCleartextTraffic: true, 
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: { backgroundColor: '#000000' },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      URL: apiUrl
    },
  },
};
