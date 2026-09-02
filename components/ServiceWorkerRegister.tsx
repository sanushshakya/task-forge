// components/ServiceWorkerRegister.tsx

import { useEffect } from 'react';

/**
 * ServiceWorkerRegister component that registers /sw.js in a useEffect on mount if navigator.serviceWorker is available.
 */
const ServiceWorkerRegister: React.FC = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered with scope:', registration.scope);
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      };

      registerServiceWorker();
    } else {
      console.warn('Service workers are not supported in this environment.');
    }

    return () => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
      }
    };
  }, []);

  return null;
};

export default ServiceWorkerRegister;