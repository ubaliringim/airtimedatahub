import React from 'react';
import { Smartphone } from 'lucide-react';

interface NetworkSelectorProps {
  selectedNetwork: string | null;
  onSelectNetwork: (network: string) => void;
}

const networkIcons: Record<string, JSX.Element> = {
  MTN: <span className="font-bold text-yellow-500">M</span>,
  GLO: <span className="font-bold text-green-600">G</span>,
  AIRTEL: <span className="font-bold text-red-500">A</span>,
  '9MOBILE': <span className="font-bold text-green-700">9</span>,
};

const networks = [
  { name: 'MTN', color: 'bg-yellow-400', text: 'text-gray-900' },
  { name: 'GLO', color: 'bg-green-500', text: 'text-white' },
  { name: 'AIRTEL', color: 'bg-red-500', text: 'text-white' },
  { name: '9MOBILE', color: 'bg-green-600', text: 'text-white' },
];

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ selectedNetwork, onSelectNetwork }) => {
  return (
    <div className="telegram-wow-card fade-in mb-6">
      <h3 className="text-lg font-semibold mb-2 text-[#229ED9] text-center">Select Network</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {networks.map((network) => (
          <button
            key={network.name}
            className={`network-wow-btn ${selectedNetwork === network.name ? 'selected' : ''}`}
            onClick={() => onSelectNetwork(network.name)}
          >
            <span className="mb-1 text-2xl">
              {networkIcons[network.name] || <Smartphone />}
            </span>
            <span className="font-bold text-sm">
              {network.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NetworkSelector;