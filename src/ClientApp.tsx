import { useEffect } from 'react';
import App from './App';
import Toaster from './components/Toaster';
import { initStore } from './lib/store';

export default function ClientApp() {
  useEffect(() => { initStore(); }, []);
  return (
    <>
      <App />
      <Toaster />
    </>
  );
}
