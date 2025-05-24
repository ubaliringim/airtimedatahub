import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, CreditCard } from 'lucide-react';
// import Header from './components/Header';
import NetworkSelector from './components/NetworkSelector';
import ServiceSelector from './components/ServiceSelector';
import PurchaseForm from './components/PurchaseForm';
import { useTelegramUser } from "./useTelegramUser";

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
  const [walletBalance, setWalletBalance] = useState<number | null>(2500.00); // Placeholder
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const telegramUser = useTelegramUser();
  const [isPhoneNumberRequested, setIsPhoneNumberRequested] = useState(false);

  useEffect(() => {
    // Initialize Telegram Mini App
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }, []);

  useEffect(() => {
    if (telegramUser) {
      console.log("Telegram User:", telegramUser);
      // Send user info to backend for registration/authentication
      fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramUser }),
      }).then(response => response.json())
        .then(data => console.log("Response from server:", data))
        .catch(error => console.error("Error sending user data:", error));
    }
  }, [telegramUser]);

  useEffect(() => {
    if (telegramUser && !isPhoneNumberRequested) {
      // Check if the phone number is already stored
      fetch(`/api/check-phone-number?telegramId=${telegramUser.id}`)
        .then(response => response.json())
        .then(data => {
          if (!data.phoneNumber) {
            // Request phone number if not stored
            window.Telegram.WebApp.showPopup({
              title: 'Phone Number Required',
              message: 'Please enter your phone number:',
              buttons: [
                { text: 'Submit', type: 'input', placeholder: 'Enter phone number' }
              ],
              onSubmit: (inputValue: string) => {
                // Send phone number to backend for storage
                fetch('/api/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ telegramUser, phoneNumber: inputValue }),
                })
                .then(response => response.json())
                .then(data => console.log('Phone number stored:', data))
                .catch(error => console.error('Error storing phone number:', error));
              }
            });
            setIsPhoneNumberRequested(true);
          }
        })
        .catch(error => console.error('Error checking phone number:', error));
    }
  }, [telegramUser, isPhoneNumberRequested]);

  const handlePurchaseComplete = () => {
    // Close the Mini App after purchase
    window.Telegram.WebApp.close();
  };

  if (!telegramUser) {
    return <div>Loading Telegram user...</div>;
  }

  return (
    <div>
      {/* <Header /> */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-[#6eb5d6] shadow-lg p-6 max-w-2xl mx-auto">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-[#229ED9] rounded-full p-3 shadow mb-2">
              <CreditCard size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#222] tracking-tight mb-1">Buy Airtime or Data</h2>
            <p className="text-[#222] text-base text-center font-medium">Fast, secure, and reliable top-up for all networks</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-4 gap-2">
            <div className="font-semibold text-lg text-gray-800">
              Wallet Balance: <span className="text-blue-600 font-bold">{walletBalance !== null ? `₦${walletBalance.toFixed(2)}` : '...'}</span>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition font-semibold"
              onClick={() => setShowFundModal(true)}
              type="button"
            >
              Fund Wallet
            </button>
          </div>

          {showFundModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-xl shadow-lg p-6 w-80 relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
                  onClick={() => setShowFundModal(false)}
                  type="button"
                  aria-label="Close"
                >
                  ×
                </button>
                <h2 className="text-lg font-bold mb-4 text-center">Fund Wallet</h2>
                <input
                  type="number"
                  min="100"
                  className="input-modern mb-4 w-full"
                  placeholder="Enter amount"
                  value={fundAmount}
                  onChange={e => setFundAmount(e.target.value)}
                  required
                />
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    // No funding logic yet
                    onClick={() => setShowFundModal(false)}
                  >
                    Fund
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => setShowFundModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

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