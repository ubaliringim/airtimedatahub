import React from 'react';
import { Smartphone } from 'lucide-react';

interface NetworkSelectorProps {
  selectedNetwork: string | null;
  onSelectNetwork: (network: string) => void;
}

const networks = [
  { name: 'MTN', color: 'bg-yellow-400', text: 'text-gray-900' },
  { name: 'GLO', color: 'bg-green-500', text: 'text-white' },
  { name: 'AIRTEL', color: 'bg-red-500', text: 'text-white' },
  { name: '9MOBILE', color: 'bg-green-600', text: 'text-white' },
];

const networkIcons: Record<string, JSX.Element> = {
  MTN: <span className="font-bold text-yellow-500">M</span>,
  GLO: <span className="font-bold text-green-600">G</span>,
  AIRTEL: <span className="font-bold text-red-500">A</span>,
  '9MOBILE': <span className="font-bold text-green-700">9</span>,
};

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ selectedNetwork, onSelectNetwork }) => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-2 text-blue-700 text-center">Select Network</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {networks.map((network) => (
          <button
            key={network.name}
            className={`network-wow-btn flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-150 bg-white hover:scale-105 focus:outline-none
              ${selectedNetwork === network.name ? 'selected border-2 border-[#229ED9] text-[#229ED9] font-bold' : 'border-gray-200 text-gray-700'}`}
            onClick={() => onSelectNetwork(network.name)}
          >
            <span className="mb-1 text-3xl">
              {networkIcons[network.name] || <Smartphone className="text-[#229ED9]" />}
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