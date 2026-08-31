// next.config.js
module.exports = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false,
  },
  manifest: {
    name: 'Your App Name',
    short_name: 'AppName',
    description: 'A brief description of your app.',
    themeColor: '#000000',
    background_color: '#ffffff',
    display: 'standalone',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
    },
  },
};