// components/ServiceWorkerRegister.test.tsx

import React from 'react';
import { render } from '@testing-library/react';
import ServiceWorkerRegister from './ServiceWorkerRegister';

describe('ServiceWorkerRegister', () => {
  it('should register the service worker if navigator.serviceWorker is available', () => {
    // Mocking navigator.serviceWorker
    const mockRegister = jest.fn();
    Object.defineProperty(window, 'serviceWorker', {
      writable: true,
      value: { register: mockRegister },
    });

    render(<ServiceWorkerRegister />);

    expect(mockRegister).toHaveBeenCalledWith('/sw.js');
  });

  it('should not register the service worker if navigator.serviceWorker is not available', () => {
    // Mocking navigator.serviceWorker
    Object.defineProperty(window, 'serviceWorker', {
      writable: true,
      value: null,
    });

    render(<ServiceWorkerRegister />);

    expect(navigator.serviceWorker.register).not.toHaveBeenCalled();
  });
});