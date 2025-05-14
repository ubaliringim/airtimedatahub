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
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Buy Airtime or Data</h2>
          
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