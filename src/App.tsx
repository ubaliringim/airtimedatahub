import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, CreditCard } from 'lucide-react';
// import Header from './components/Header';
import NetworkSelector from './components/NetworkSelector';
import ServiceSelector from './components/ServiceSelector';
import PurchaseForm from './components/PurchaseForm';

declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

const App: React.FC = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<'airtime' | 'data' | null>(null);

  useEffect(() => {
    // Initialize Telegram Mini App
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }, []);

  const handlePurchaseComplete = () => {
    // Close the Mini App after purchase
    window.Telegram.WebApp.close();
  };

  return (
    <div>
      {/* <Header /> */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-[#6eb5d6] shadow-lg p-6 max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-6">
            <div className="bg-[#229ED9] rounded-full p-3 shadow mb-2">
              <CreditCard size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#222] tracking-tight mb-1">Buy Airtime or Data</h2>
            <p className="text-[#222] text-sm text-center">Fast, secure, and reliable top-up for all networks</p>
          </div>
          
          <NetworkSelector
            selectedNetwork={selectedNetwork}
            onSelectNetwork={setSelectedNetwork}
          />

          {selectedNetwork && (
            <ServiceSelector
              selectedService={selectedService}
              onSelectService={setSelectedService}
            />
          )}

          {selectedNetwork && selectedService && (
            <PurchaseForm
              network={selectedNetwork}
              service={selectedService}
              onPurchaseComplete={handlePurchaseComplete}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;